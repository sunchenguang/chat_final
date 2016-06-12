import template from "./sidebar.html!text";
import SidebarController from "./sidebar.controller";

function sidebarDirective($location) {
  return {
    restrict: "E",
    replace: true,
    scope: true,
    template: template,
    bindToController: true,
    controllerAs: "ctrl",
    controller: SidebarController
  };
}

sidebarDirective.$inject = ['$location'];

export default sidebarDirective;
