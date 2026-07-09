"use strict";

sap.ui.define(["sap/m/Avatar", "sap/m/Button", "sap/m/FlexBox", "sap/m/Label", "sap/m/Title", "sap/ui/base/Object", "sap/uxap/ObjectPageDynamicHeaderTitle", "sap/uxap/ObjectPageLayout", "sap/uxap/ObjectPageSection", "sap/uxap/ObjectPageSubSection"], function (Avatar, Button, FlexBox, Label, Title, BaseObject, ObjectPageDynamicHeaderTitle, ObjectPageLayout, ObjectPageSection, ObjectPageSubSection) {
  "use strict";

  /**
   * @namespace ui5.antares.ui
   */
  const ObjectPageLayoutCL = BaseObject.extend("ui5.antares.ui.ObjectPageLayoutCL", {
    constructor: function _constructor(headerText, avatarSrc, headerLabel) {
      BaseObject.prototype.constructor.call(this);
      const avatar = new Avatar({
        src: avatarSrc
      });
      avatar.addStyleClass("sapUiTinyMarginEnd");
      const label = new Label({
        text: headerLabel
      });
      label.addStyleClass("sapUiTinyMarginBegin");
      this.objectPageLayout = new ObjectPageLayout({
        id: "UI5AntaresObjectPageViewID--UI5AntaresObjectPageLayout",
        upperCaseAnchorBar: false,
        headerTitle: new ObjectPageDynamicHeaderTitle({
          expandedHeading: new Title({
            text: headerText,
            wrapping: true
          }),
          snappedHeading: new FlexBox({
            fitContainer: true,
            alignItems: "Center",
            items: [avatar, new Title({
              text: headerText,
              wrapping: true
            })]
          })
        }),
        headerContent: new FlexBox({
          wrap: "Wrap",
          fitContainer: true,
          alignItems: "Center",
          items: [new Avatar({
            src: avatarSrc
          }), label]
        })
      });
    },
    addCompleteButton: function _addCompleteButton(buttonText, buttonType) {
      const headerTitle = this.objectPageLayout.getHeaderTitle();
      headerTitle.addAction(new Button({
        id: "UI5AntaresObjectPageViewID--UI5AntaresObjectPageCompleteButton",
        text: buttonText,
        type: buttonType
      }));
    },
    addCancelButton: function _addCancelButton(buttonText, buttonType) {
      const headerTitle = this.objectPageLayout.getHeaderTitle();
      headerTitle.addAction(new Button({
        id: "UI5AntaresObjectPageViewID--UI5AntaresObjectPageCancelButton",
        text: buttonText,
        type: buttonType
      }));
    },
    addSection: function _addSection(content, sectionTitle) {
      const subSection = new ObjectPageSubSection({
        titleUppercase: false,
        blocks: content
      });
      const section = new ObjectPageSection({
        titleUppercase: false,
        title: sectionTitle,
        subSections: subSection
      });
      this.objectPageLayout.addSection(section);
    },
    addEmptySection: function _addEmptySection(sectionTitle) {
      const subSection = new ObjectPageSubSection({
        titleUppercase: false
      });
      this.emptySection = new ObjectPageSection({
        titleUppercase: false,
        title: sectionTitle,
        subSections: subSection
      });
      this.objectPageLayout.addSection(this.emptySection);
    },
    addContentToSection: function _addContentToSection(content) {
      this.emptySection.getSubSections()[0].addBlock(content);
    },
    getObjectPageLayout: function _getObjectPageLayout() {
      return this.objectPageLayout;
    }
  });
  return ObjectPageLayoutCL;
});
