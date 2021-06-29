## About
A library for unobtrusive ajax using `data-ajax*` attributes.

## Attributes
- `data-ajax`: **required** Enables unobstrusive ajax
- `data-ajax-update`: **required** Element to update the response with
- `data-ajax-method`: Override `GET` for `a`, `method` for `form`. Set ajax method for `input`, `select`, `button` and `textarea`. Can be `GET`, `POST`, `PUT`, `DELETE`
- `data-ajax-url`: Override `href` for `a`, `action` for `form`. Set ajax URL for `input`, `select`, `button` and `textarea`
- `data-ajax-loading`: Show an element (e.g., spinner) while performing ajax call
- `data-ajax-confirm`: Confirm message to show before triggering the ajax. If not confirmed, then ajax action is not performed. Not applicable on `input`, `select` and `textarea`
- `data-ajax-mode`: How to replace the element specified in `data-ajax-update`. Default is to replace inner html. Other options: `BEFORE`, `AFTER`, `REPLACE-WITH` (Replace inner html including element)

## Additional Attributes
- `data-ajax-disable`: Disable the element during ajax operation
- `data-ajax-disable-with`: Disable the element during ajax operation with a message

## Events Triggers
Events triggered on the element attached with `[data-ajax]`:
- `ajax-before`: Triggered before request is prepared. Can be **cancelled** by returning `false`. Event Handler Parameters ```(event, element, clickedElement)```
- `ajax-before-send`: Triggered before request is sent. Can be **cancelled** by returning `false`. Event Handler Parameters ```(event, element, xhr, settings, clickedElement)```. Can be used to change `settings` and `xhr` config
- `ajax-send`: Triggered when request is sent. Event Handler Parameters ```(event, element, xhr, settings, clickedElement)```
- `ajax-success`: Triggered when request is successful. Event Handler Parameters ```(event, element, xhr, status, data, clickedElement)```
- `ajax-error`: Triggered on request error. Event Handler Parameters ```(event, element, xhr, status, error, clickedElement)```
- `ajax-complete`: Triggered when request is complete. This event may not trigger as the element may not exists after success response. Event Handler Parameters ```(event, element, xhr, status, clickedElement)```

Event triggered on the element `data-ajax-update`:
- `ajax-update`: Triggered after successful update of the element. Event Handler Parameters ```(event, element, data)```

## Requirements
- [jQuery](https://jquery.com)
- (Optional#) [jQuery Validation Unobtrusive](https://cdnjs.com/libraries/jquery-validation-unobtrusive) with [jQuery Validation](https://jqueryvalidation.org/)
