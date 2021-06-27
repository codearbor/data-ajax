import { setupLinks } from './links';
import { setupButtons } from './buttons';
import { setupInputChange } from './change';
import { setupForms } from './forms';
import { setupValidation } from './validator';
import { setupFormExt } from './formExt';

(function ($) {

  setupLinks();
  setupButtons();
  setupInputChange();
  setupForms();
  setupFormExt();
  setupValidation();

}(jQuery));
