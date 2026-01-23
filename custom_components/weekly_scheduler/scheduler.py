"""Time calculation engine for Weekly Scheduler."""

from datetime import datetime, time, timedelta
from typing import Any

from .const import DAYS, MINUTES_PER_SLOT


def time_to_minutes(t: str) -> int:
    """Convert HH:MM string to minutes since midnight."""
    parts = t.split(":")
    return int(parts[0]) * 60 + int(parts[1])


def minutes_to_time(minutes: int) -> str:
    """Convert minutes since midnight to HH:MM string."""
    hours = minutes // 60
    mins = minutes % 60
    return f"{hours:02d}:{mins:02d}"


def get_current_day_name(dt: datetime | None = None) -> str:
    """Get the lowercase day name for a datetime."""
    if dt is None:
        dt = datetime.now()
    return DAYS[dt.weekday()]


def get_current_time_str(dt: datetime | None = None) -> str:
    """Get current time as HH:MM string."""
    if dt is None:
        dt = datetime.now()
    return f"{dt.hour:02d}:{dt.minute:02d}"


def find_active_timeblock(
    schedule: dict[str, list[dict[str, Any]]],
    day: str,
    current_time: str,
) -> dict[str, Any] | None:
    """Find the timeblock that contains the current time.

    Args:
        schedule: The full weekly schedule
        day: Day name (e.g., 'monday')
        current_time: Time as HH:MM string

    Returns:
        The active timeblock dict or None if in a gap
    """
    current_minutes = time_to_minutes(current_time)
    day_schedule = schedule.get(day, [])

    for block in day_schedule:
        start_minutes = time_to_minutes(block["start"])
        end_minutes = time_to_minutes(block["end"])

        # Handle blocks that end at midnight (00:00 means 24:00)
        if end_minutes == 0:
            end_minutes = 24 * 60

        if start_minutes <= current_minutes < end_minutes:
            return block

    return None


def find_previous_timeblock(
    schedule: dict[str, list[dict[str, Any]]],
    day: str,
    current_time: str,
) -> tuple[dict[str, Any] | None, str | None]:
    """Find the most recent timeblock before current time (gap inheritance).

    Searches backwards through today and previous days to find the last
    timeblock that ended before the current time.

    Args:
        schedule: The full weekly schedule
        day: Current day name
        current_time: Current time as HH:MM string

    Returns:
        Tuple of (timeblock dict or None, day name or None)
    """
    current_minutes = time_to_minutes(current_time)
    day_index = DAYS.index(day)

    # First check today for blocks that ended before current time
    today_schedule = schedule.get(day, [])
    latest_block = None
    latest_end = -1

    for block in today_schedule:
        end_minutes = time_to_minutes(block["end"])
        if end_minutes == 0:
            end_minutes = 24 * 60

        if end_minutes <= current_minutes and end_minutes > latest_end:
            latest_end = end_minutes
            latest_block = block

    if latest_block:
        return latest_block, day

    # Search previous days (wrap around week)
    for i in range(1, 8):
        prev_day_index = (day_index - i) % 7
        prev_day = DAYS[prev_day_index]
        prev_schedule = schedule.get(prev_day, [])

        if not prev_schedule:
            continue

        # Find the block with the latest end time on that day
        latest_block = None
        latest_end = -1

        for block in prev_schedule:
            end_minutes = time_to_minutes(block["end"])
            if end_minutes == 0:
                end_minutes = 24 * 60

            if end_minutes > latest_end:
                latest_end = end_minutes
                latest_block = block

        if latest_block:
            return latest_block, prev_day

    return None, None


def get_effective_value(
    schedule: dict[str, list[dict[str, Any]]],
    day: str,
    current_time: str,
    default_value: Any = None,
) -> tuple[Any, dict[str, Any] | None]:
    """Get the effective value at the current time.

    If currently in a timeblock, return that value.
    If in a gap, inherit from the previous timeblock.

    Args:
        schedule: The full weekly schedule
        day: Current day name
        current_time: Current time as HH:MM string
        default_value: Value to use if no timeblocks exist

    Returns:
        Tuple of (effective value, active timeblock or None)
    """
    # Check if we're in an active timeblock
    active_block = find_active_timeblock(schedule, day, current_time)
    if active_block:
        return active_block.get("value"), active_block

    # We're in a gap - inherit from previous timeblock
    prev_block, _ = find_previous_timeblock(schedule, day, current_time)
    if prev_block:
        return prev_block.get("value"), None

    return default_value, None


def get_next_timeblock_start(
    schedule: dict[str, list[dict[str, Any]]],
    day: str,
    current_time: str,
) -> tuple[str | None, str | None]:
    """Find when the next timeblock starts.

    Used to know when a manual override should end.

    Args:
        schedule: The full weekly schedule
        day: Current day name
        current_time: Current time as HH:MM string

    Returns:
        Tuple of (time string, day name) or (None, None) if no future blocks
    """
    current_minutes = time_to_minutes(current_time)
    day_index = DAYS.index(day)

    # Check remaining blocks today
    today_schedule = schedule.get(day, [])
    for block in sorted(today_schedule, key=lambda b: time_to_minutes(b["start"])):
        start_minutes = time_to_minutes(block["start"])
        if start_minutes > current_minutes:
            return block["start"], day

    # Check future days
    for i in range(1, 8):
        next_day_index = (day_index + i) % 7
        next_day = DAYS[next_day_index]
        next_schedule = schedule.get(next_day, [])

        if next_schedule:
            # Return the first block of that day
            first_block = min(next_schedule, key=lambda b: time_to_minutes(b["start"]))
            return first_block["start"], next_day

    return None, None


def is_at_timeblock_boundary(
    schedule: dict[str, list[dict[str, Any]]],
    day: str,
    current_time: str,
) -> bool:
    """Check if current time is at the start of a timeblock.

    Used to determine when to apply scheduled values and clear manual overrides.

    Args:
        schedule: The full weekly schedule
        day: Current day name
        current_time: Current time as HH:MM string

    Returns:
        True if at a timeblock boundary
    """
    day_schedule = schedule.get(day, [])
    for block in day_schedule:
        if block["start"] == current_time:
            return True
    return False


def validate_timeblock(block: dict[str, Any]) -> list[str]:
    """Validate a timeblock entry.

    Args:
        block: Timeblock dict with start, end, value

    Returns:
        List of validation error messages (empty if valid)
    """
    errors = []

    if "start" not in block:
        errors.append("Missing 'start' field")
    if "end" not in block:
        errors.append("Missing 'end' field")
    if "value" not in block:
        errors.append("Missing 'value' field")

    if errors:
        return errors

    # Validate time format
    for field in ["start", "end"]:
        try:
            parts = block[field].split(":")
            if len(parts) != 2:
                raise ValueError()
            hours = int(parts[0])
            minutes = int(parts[1])
            if not (0 <= hours <= 23 and 0 <= minutes <= 59):
                raise ValueError()
        except (ValueError, AttributeError):
            errors.append(f"Invalid time format for '{field}': {block[field]}")

    # Validate that end is after start (unless end is 00:00 meaning midnight)
    if not errors:
        start_minutes = time_to_minutes(block["start"])
        end_minutes = time_to_minutes(block["end"])
        if end_minutes != 0 and end_minutes <= start_minutes:
            errors.append(f"End time must be after start time: {block['start']} - {block['end']}")

    return errors


def validate_day_schedule(day_schedule: list[dict[str, Any]]) -> list[str]:
    """Validate a day's schedule for overlaps.

    Args:
        day_schedule: List of timeblocks for a single day

    Returns:
        List of validation error messages
    """
    errors = []

    # Validate each block
    for i, block in enumerate(day_schedule):
        block_errors = validate_timeblock(block)
        for error in block_errors:
            errors.append(f"Block {i + 1}: {error}")

    if errors:
        return errors

    # Check for overlaps
    sorted_blocks = sorted(day_schedule, key=lambda b: time_to_minutes(b["start"]))
    for i in range(len(sorted_blocks) - 1):
        current_end = time_to_minutes(sorted_blocks[i]["end"])
        if current_end == 0:
            current_end = 24 * 60
        next_start = time_to_minutes(sorted_blocks[i + 1]["start"])

        if current_end > next_start:
            errors.append(
                f"Overlapping blocks: {sorted_blocks[i]['start']}-{sorted_blocks[i]['end']} "
                f"and {sorted_blocks[i + 1]['start']}-{sorted_blocks[i + 1]['end']}"
            )

    return errors


def merge_adjacent_blocks(day_schedule: list[dict[str, Any]]) -> list[dict[str, Any]]:
    """Merge adjacent timeblocks with the same value.

    Args:
        day_schedule: List of timeblocks for a single day

    Returns:
        Optimized list with adjacent same-value blocks merged
    """
    if not day_schedule:
        return []

    sorted_blocks = sorted(day_schedule, key=lambda b: time_to_minutes(b["start"]))
    merged = [sorted_blocks[0].copy()]

    for block in sorted_blocks[1:]:
        last = merged[-1]
        last_end = time_to_minutes(last["end"])
        if last_end == 0:
            last_end = 24 * 60
        block_start = time_to_minutes(block["start"])

        # Merge if adjacent and same value
        if last_end == block_start and last.get("value") == block.get("value"):
            merged[-1]["end"] = block["end"]
        else:
            merged.append(block.copy())

    return merged
