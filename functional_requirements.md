# Functional requirements for a weekly scheduler

This scheduler will run on homeassistant as and add-on. 

## Functionality

This scheduler will change the value of a helper entity (which must be selectable at the time of configuration). The changes will happen based on a schedule. The smallest time increment is 1 minute. The default time block is 30 minutes. 
The schedule allows to setup time blocks per weekday. The schedule should have the options to:

 - treat all days of a week the same
 - treat workdays the same and the weekend the same
 - allow individual schedule per day of the week
The user should be able to configure as many timeblocks per day as he wishes. each timeblock must have the value of the helper assigned. If there is no value assigned, the value of the previous timeblock is assigned to the timeblock without the value (to prevent errors).

## User interface

The User interface should be graphical, similar to the weekly view of the Microsoft Outlook Calendar with 30 min timeblocks.  
User can graphically select timeblocks and assign the helper's value for that time block (similarly to organizing meetings in the Outlook). 
The whole add on should be packaged based on the standard add-on package structure for the homeassistant in order to be added through the HA user interface. 

 Weekly Scheduler - Requirements Summary

  Type: Home Assistant Custom Integration (HACS-compatible)

  Core Features:
  - Controls input_number or input_boolean helper entities
  - Single schedule per installation
  - 30-minute default timeblocks (minimum 1-minute granularity)
  - Enable/disable toggle to pause scheduling

  Schedule Options:
  - All days identical
  - Workdays same / Weekend same
  - Individual schedule per weekday

  Behavior:
  - Gaps use the previous timeblock's value
  - On startup/restart, immediately apply current time slot value
  - Validate input_number values against min/max bounds

  User Interface:
  - Native Home Assistant Panel integration
  - Outlook weekly calendar-style view
  - Drag to select multiple consecutive blocks
  - Inline editing (click block, type value directly)
  - Time format follows HA settings

  Technical:
  - Python-based integration with detailed comments
  - Uses HA config entries for storage
  - HACS-ready package structure

The schedule should be stored in a JSON into entity type switch. Example: {"HotWater": {"friday": [{"end": "23:59", "start": "00:00", "temperature": 55.0}], "monday": [{"end": "23:59", "start": "00:00", "temperature": 55.0}], "saturday": [{"end": "23:59", "start": "00:00", "temperature": 55.0}], "sunday": [{"end": "23:59", "start": "00:00", "temperature": 55.0}], "thursday": [{"end": "23:59", "start": "00:00", "temperature": 55.0}], "tuesday": [{"end": "23:59", "start": "00:00", "temperature": 55.0}], "wednesday": [{"end": "23:59", "start": "00:00", "temperature": 55.0}]}}
The name of the entity should start with switch.helper_[name of the helper which is being managed through the schedule]
