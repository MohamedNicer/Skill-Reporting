import BaseController from "com/ndbs/skillreportingui/controller/BaseController";
import { IPage } from "../util/common/common.types";
import PageCL from "com/ndbs/skillreportingui/util/common/PageCL";
import { Routes } from "../types/global.types";
import { Model$RequestFailedEvent } from "sap/ui/model/Model";
import JSONModel from "sap/ui/model/json/JSONModel";
import Dialog from "sap/m/Dialog";
import Button from "sap/m/Button";
import List from "sap/m/List";
import StandardListItem from "sap/m/StandardListItem";
import Select from "sap/m/Select";
import Item from "sap/ui/core/Item";
import Input from "sap/m/Input";
import TextArea from "sap/m/TextArea";
import StepInput from "sap/m/StepInput";
import SearchField from "sap/m/SearchField";
import VBox from "sap/m/VBox";
import HBox from "sap/m/HBox";
import Label from "sap/m/Label";
import Text from "sap/m/Text";
import Title from "sap/m/Title";
import Avatar from "sap/m/Avatar";
import MessageToast from "sap/m/MessageToast";
import MessageBox from "sap/m/MessageBox";
import ObjectStatus from "sap/m/ObjectStatus";
import MessageStrip from "sap/m/MessageStrip";
import SimpleForm from "sap/ui/layout/form/SimpleForm";

/**
 * @namespace com.ndbs.skillreportingui.controller
 */
export default class EmployeeSkills extends BaseController implements IPage {

    public onInit(): void {
        const page = new PageCL<EmployeeSkills>(this, Routes.EMPLOYEE_SKILLS);
        page.initialize();
    }

    public async onObjectMatched(): Promise<void> {
        this.getComponentModel()?.attachRequestFailed({}, this.onODataRequestFail, this);
        await this.loadGroupedEmployeeSkills();
    }

    public onSearch(event: any): void {
        const query = event.getParameter("query") ?? event.getSource()?.getValue() ?? "";
        this.loadGroupedEmployeeSkills(query);
    }

    private getCategoryIcon(catName: string): string {
        const lower = (catName || "").toLowerCase();
        if (lower.includes("cloud")) return "sap-icon://cloud";
        if (lower.includes("program") || lower.includes("lang") || lower.includes("code")) return "sap-icon://source-code";
        if (lower.includes("ai") || lower.includes("science") || lower.includes("machine") || lower.includes("learning")) return "sap-icon://area-chart";
        if (lower.includes("data") || lower.includes("db")) return "sap-icon://database";
        if (lower.includes("devops") || lower.includes("ci") || lower.includes("cd") || lower.includes("tool")) return "sap-icon://process";
        if (lower.includes("soft") || lower.includes("manage") || lower.includes("lead")) return "sap-icon://group";
        if (lower.includes("sap")) return "sap-icon://sys-enter-2";
        return "sap-icon://education";
    }

    public async loadGroupedEmployeeSkills(searchQuery?: string): Promise<void> {
        const view = this.getView();
        if (!view) return;

        view.setBusy(true);
        try {
            const response = await fetch("/odata/v2/employee-profile/VEmployeeSkills?$format=json&$orderby=categoryName asc,skillName asc");
            if (response.ok) {
                const data = await response.json();
                const results: any[] = data.d?.results || data.value || [];

                let filtered = results;
                if (searchQuery && searchQuery.trim() !== "") {
                    const q = searchQuery.toLowerCase().trim();
                    filtered = results.filter((r: any) =>
                        (r.skillName && r.skillName.toLowerCase().includes(q)) ||
                        (r.categoryName && r.categoryName.toLowerCase().includes(q)) ||
                        (r.proficiencyLevel && r.proficiencyLevel.toLowerCase().includes(q)) ||
                        (r.employeeName && r.employeeName.toLowerCase().includes(q))
                    );
                }

                let validatedCount = 0;
                let pendingCount = 0;
                filtered.forEach((r: any) => {
                    if (r.validationStatus === "verified" || r.validationStatus === "managerConfirmed" || r.validationStatus === "managerValidated") {
                        validatedCount++;
                    } else {
                        pendingCount++;
                    }
                });

                // Group items by categoryName
                const groupsMap: { [key: string]: any[] } = {};
                filtered.forEach((item: any) => {
                    const cat = item.categoryName || "Uncategorized";
                    if (!groupsMap[cat]) {
                        groupsMap[cat] = [];
                    }
                    groupsMap[cat].push(item);
                });

                const categories = Object.keys(groupsMap).map((catName: string) => {
                    const skillsInGroup = groupsMap[catName];
                    return {
                        categoryName: catName,
                        icon: this.getCategoryIcon(catName),
                        count: skillsInGroup.length,
                        skills: skillsInGroup
                    };
                });

                let groupedModel = view.getModel("groupedSkillsModel") as JSONModel;
                if (!groupedModel) {
                    groupedModel = new JSONModel();
                    view.setModel(groupedModel, "groupedSkillsModel");
                }
                groupedModel.setData({
                    categories,
                    totalCount: filtered.length,
                    validatedCount,
                    pendingCount
                });
            }
        } catch (error) {
            console.error("Failed to load employee skills", error);
        } finally {
            view.setBusy(false);
        }
    }

    /**
     * [+ Add Skill]: Displays available catalog skills (minus skills already assigned to employee)
     * and submits both a profile skill addition AND an automatic SkillRequest to Admin.
     */
    public async onAddSkill(): Promise<void> {
        const view = this.getView();
        if (!view) return;

        view.setBusy(true);
        let catalogSkills: any[] = [];
        let assignedSkillIds: string[] = [];

        try {
            const empRes = await fetch("/odata/v2/employee-profile/VEmployeeSkills?$format=json");
            if (empRes.ok) {
                const empData = await empRes.json();
                const assigned = empData.d?.results || empData.value || [];
                assignedSkillIds = assigned.map((a: any) => a.skillID);
            }

            const catRes = await fetch("/odata/v2/catalog/Skills?$expand=toCategory&$format=json&$orderby=canonicalName asc");
            if (catRes.ok) {
                const catData = await catRes.json();
                const rawSkills = catData.d?.results || catData.value || [];
                catalogSkills = rawSkills.filter((s: any) => s.isActive && s.status !== "deprecated" && s.status !== "inactive");
            }
        } catch (err) {
            console.error("Failed to fetch skills", err);
        } finally {
            view.setBusy(false);
        }

        const availableSkills = catalogSkills.filter((s: any) => !assignedSkillIds.includes(s.ID));

        if (availableSkills.length === 0) {
            MessageBox.information("You already have all active catalog skills assigned to your profile.");
            return;
        }

        let selectedSkill: any = null;

        const infoBanner = new MessageStrip({
            text: `Select a catalog skill (${availableSkills.length} available) to add it to your profile and submit for admin validation.`,
            type: "Information",
            showIcon: true,
            showCloseButton: false,
            class: "sapUiSmallMarginBottom"
        });

        const searchField = new SearchField({
            placeholder: "Search available catalog skills or category...",
            width: "100%",
            class: "sapUiSmallMarginBottom",
            liveChange: (evt: any) => {
                const q = (evt.getParameter("newValue") || "").toLowerCase().trim();
                const items = skillList.getItems();
                items.forEach((item: any) => {
                    const title = (item.getTitle() || "").toLowerCase();
                    const desc = (item.getDescription() || "").toLowerCase();
                    item.setVisible(!q || title.includes(q) || desc.includes(q));
                });
            }
        });

        const skillList = new List({
            mode: "SingleSelectMaster",
            selectionChange: (evt: any) => {
                const selectedItem = evt.getParameter("listItem");
                if (selectedItem) {
                    selectedSkill = selectedItem.getCustomData()[0].getValue();
                    showStep2(selectedSkill);
                }
            }
        });

        availableSkills.forEach((s: any) => {
            const catName = s.toCategory?.name || s.categoryName || "Uncategorized";
            let img = s.imageUrl || "sap-icon://education";
            if (img && !img.startsWith("sap-icon://") && !img.startsWith("http") && !img.startsWith("/")) {
                img = "../../" + img;
            }

            const item = new StandardListItem({
                title: s.canonicalName,
                description: catName,
                icon: img,
                type: "Active"
            });
            item.addCustomData(new (sap.ui.core.CustomData as any)({ key: "skill", value: s }));
            skillList.addItem(item);
        });

        const step1Box = new VBox({
            class: "sapUiSmallMargin",
            items: [infoBanner, searchField, skillList]
        });

        const step2SkillTitle = new Title({ level: "H3" });
        const step2CategoryBadge = new ObjectStatus({ state: "Information", class: "badge-count sapUiTinyMarginTop" });
        const step2Avatar = new Avatar({ displaySize: "M", class: "sapUiSmallMarginEnd" });
        const selectedHeaderBox = new HBox({
            alignItems: "Center",
            class: "sapUiSmallMarginBottom",
            items: [
                step2Avatar,
                new VBox({ items: [step2SkillTitle, step2CategoryBadge] })
            ]
        });

        const profSelect = new Select({
            width: "100%",
            items: [
                new Item({ key: "PL1", text: "Beginner (Basic understanding & assistance required)" }),
                new Item({ key: "PL2", text: "Intermediate (Practical application & independent execution)" }),
                new Item({ key: "PL3", text: "Advanced (Deep knowledge & capability to guide others)" }),
                new Item({ key: "PL4", text: "Expert (Advanced expertise & strategic domain leadership)" }),
                new Item({ key: "PL5", text: "Master (Subject matter authority & innovation leader)" })
            ]
        });
        profSelect.setSelectedKey("PL2");

        const expInput = new StepInput({
            value: 1.0,
            min: 0.5,
            max: 50,
            step: 0.5,
            displayValuePrecision: 1,
            width: "100%"
        });

        const step2Form = new SimpleForm({
            editable: true,
            layout: "ColumnLayout",
            columnsM: 1,
            columnsL: 1,
            singleContainerFullWidth: true,
            content: [
                new Label({ text: "Select Proficiency Level", required: true }),
                profSelect,
                new Label({ text: "Years of Experience", required: true }),
                expInput
            ]
        });

        const step2Box = new VBox({
            visible: false,
            class: "sapUiSmallMargin",
            items: [selectedHeaderBox, step2Form]
        });

        const containerBox = new VBox({
            items: [step1Box, step2Box]
        });

        const btnAdd = new Button({
            text: "Add & Request Skill",
            type: "Emphasized",
            visible: false,
            press: async () => {
                if (!selectedSkill) return;
                dialog.setBusy(true);

                try {
                    const payload = {
                        skillID: selectedSkill.ID,
                        proficiencyLevelID: profSelect.getSelectedKey(),
                        yearsExperience: expInput.getValue()
                    };

                    const addRes = await fetch("/odata/v2/employee-profile/addSkill", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(payload)
                    });

                    if (addRes.ok) {
                        MessageToast.show(`Skill '${selectedSkill.canonicalName}' added to profile and submitted for admin review!`);
                        dialog.close();
                        dialog.destroy();
                        await this.loadGroupedEmployeeSkills();
                    } else {
                        const err = await addRes.json();
                        MessageBox.error(err.error?.message?.value || "Failed to add skill.");
                    }
                } catch (e) {
                    console.error("Error adding skill", e);
                    MessageBox.error("An error occurred while adding skill.");
                } finally {
                    dialog.setBusy(false);
                }
            }
        });

        const btnBack = new Button({
            text: "Select Different Skill",
            visible: false,
            press: () => showStep1()
        });

        const btnCancel = new Button({
            text: "Cancel",
            press: () => {
                dialog.close();
                dialog.destroy();
            }
        });

        const showStep1 = () => {
            selectedSkill = null;
            step1Box.setVisible(true);
            step2Box.setVisible(false);
            btnAdd.setVisible(false);
            btnBack.setVisible(false);
            dialog.setTitle(`Add Skill to Profile (${availableSkills.length} Available)`);
        };

        const showStep2 = (skill: any) => {
            const catName = skill.toCategory?.name || skill.categoryName || "Uncategorized";
            let img = skill.imageUrl || "sap-icon://education";
            if (img && !img.startsWith("sap-icon://") && !img.startsWith("http") && !img.startsWith("/")) {
                img = "../../" + img;
            }

            step2Avatar.setSrc(img);
            step2SkillTitle.setText(skill.canonicalName);
            step2CategoryBadge.setText(catName);

            step1Box.setVisible(false);
            step2Box.setVisible(true);
            btnAdd.setVisible(true);
            btnBack.setVisible(true);
            dialog.setTitle(`Configure Skill: ${skill.canonicalName}`);
        };

        const dialog = new Dialog({
            title: `Add Skill to Profile (${availableSkills.length} Available)`,
            icon: "sap-icon://add",
            contentWidth: "640px",
            contentHeight: "520px",
            content: [containerBox],
            buttons: [btnBack, btnAdd, btnCancel]
        });

        view.addDependent(dialog);
        dialog.open();
    }

    /**
     * [Request New Skill]: Opens popup form for employee to enter proposed new skill details
     * (Skill Name, Category, Initial Proficiency, Experience, Justification)
     * and automatically triggers a new SkillRequest to Admin.
     */
    public async onRequestNewSkill(): Promise<void> {
        const view = this.getView();
        if (!view) return;

        view.setBusy(true);
        let categories: any[] = [];

        try {
            const catRes = await fetch("/odata/v2/catalog/SkillCategories?$format=json&$orderby=sortOrder asc");
            if (catRes.ok) {
                const catData = await catRes.json();
                categories = catData.d?.results || catData.value || [];
            }
        } catch (err) {
            console.error("Failed to load categories", err);
        } finally {
            view.setBusy(false);
        }

        const infoBanner = new MessageStrip({
            text: "Propose a new skill not currently listed in the catalog. An automatic request will be submitted to Admin for approval.",
            type: "Information",
            showIcon: true,
            showCloseButton: false,
            class: "sapUiSmallMarginBottom"
        });

        const inputSkillName = new Input({
            placeholder: "e.g. GraphQL, Rust, Terraform, S/4HANA Finance",
            width: "100%",
            required: true
        });

        const categorySelect = new Select({
            width: "100%"
        });
        categories.forEach((cat: any) => {
            categorySelect.addItem(new Item({ key: cat.ID, text: cat.name }));
        });

        const profSelect = new Select({
            width: "100%",
            items: [
                new Item({ key: "PL1", text: "Beginner (Basic understanding & assistance required)" }),
                new Item({ key: "PL2", text: "Intermediate (Practical application & independent execution)" }),
                new Item({ key: "PL3", text: "Advanced (Deep knowledge & capability to guide others)" }),
                new Item({ key: "PL4", text: "Expert (Advanced expertise & strategic domain leadership)" }),
                new Item({ key: "PL5", text: "Master (Subject matter authority & innovation leader)" })
            ]
        });
        profSelect.setSelectedKey("PL2");

        const expInput = new StepInput({
            value: 1.0,
            min: 0.5,
            max: 50,
            step: 0.5,
            displayValuePrecision: 1,
            width: "100%"
        });

        const txtJustification = new TextArea({
            rows: 3,
            placeholder: "Explain where you use this skill or why it should be added to the official catalog...",
            width: "100%"
        });

        const simpleForm = new SimpleForm({
            editable: true,
            layout: "ColumnLayout",
            columnsM: 1,
            columnsL: 1,
            singleContainerFullWidth: true,
            class: "custom-dialog-form",
            content: [
                new Label({ text: "Proposed Skill Name", required: true }),
                inputSkillName,
                new Label({ text: "Category", required: true }),
                categorySelect,
                new Label({ text: "Initial Proficiency Level", required: true }),
                profSelect,
                new Label({ text: "Years of Experience", required: true }),
                expInput,
                new Label({ text: "Justification / Notes for Admin" }),
                txtJustification
            ]
        });

        const formBox = new VBox({
            class: "sapUiSmallMargin",
            items: [infoBanner, simpleForm]
        });

        const btnSubmit = new Button({
            text: "Submit Request to Admin",
            type: "Emphasized",
            press: async () => {
                const nameVal = (inputSkillName.getValue() || "").trim();
                if (!nameVal) {
                    MessageBox.error("Please enter a proposed skill name.");
                    return;
                }

                dialog.setBusy(true);
                try {
                    const selectedCatText = categorySelect.getSelectedItem()?.getText() || "";
                    const reqText = `${nameVal} [Category: ${selectedCatText}]`;
                    const comment = txtJustification.getValue() || "New skill request proposed by employee.";

                    const payload = {
                        requestType: "newSkill",
                        requestedText: reqText,
                        status: "pendingReview",
                        adminComment: comment
                    };

                    const res = await fetch("/odata/v2/employee-profile/SkillRequests", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(payload)
                    });

                    if (res.ok) {
                        MessageToast.show(`New skill request '${nameVal}' submitted to Admin for approval!`);
                        dialog.close();
                        dialog.destroy();
                        await this.loadGroupedEmployeeSkills();
                    } else {
                        const err = await res.json();
                        MessageBox.error(err.error?.message?.value || "Failed to submit request.");
                    }
                } catch (e) {
                    console.error("Error submitting skill request", e);
                    MessageBox.error("An error occurred while submitting skill request.");
                } finally {
                    dialog.setBusy(false);
                }
            }
        });

        const btnCancel = new Button({
            text: "Cancel",
            press: () => {
                dialog.close();
                dialog.destroy();
            }
        });

        const dialog = new Dialog({
            title: "Request New Skill to Catalog",
            icon: "sap-icon://request",
            contentWidth: "640px",
            content: [formBox],
            buttons: [btnSubmit, btnCancel]
        });

        view.addDependent(dialog);
        dialog.open();
    }

    public onODataRequestFail(_event: Model$RequestFailedEvent): void {
        this.openMessagePopover();
    }
}