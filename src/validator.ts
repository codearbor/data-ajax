import { DataKey, EventOf } from "./constants";

export function setupValidation() {

  // @ts-ignore
  if ($.validator && $.validator.unobtrusive) {
    $(document).on(EventOf.UPDATED, function (evt) {
      var $target = $(evt.target),
        $form = $target.is('form') ? $target : $('form', $target);

      $form.each(function (idx, frm) {
        $(frm).removeData('validator');
        $(frm).removeData(DataKey.VALIDATOR);
        setTimeout(function () {
          // @ts-ignore
          $.validator.unobtrusive.parse($(frm));
        }, 50);
      });
    });
  }
}
