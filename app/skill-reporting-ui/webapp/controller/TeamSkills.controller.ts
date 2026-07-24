import BaseController from "com/ndbs/skillreportingui/controller/BaseController";
import { IPage } from "../util/common/common.types";
import PageCL from "com/ndbs/skillreportingui/util/common/PageCL";
import { Routes } from "../types/global.types";
import { Model$RequestFailedEvent } from "sap/ui/model/Model";
import Button from "sap/m/Button";
import MessageBox from "sap/m/MessageBox";
import Context from "sap/ui/model/Context";
import JSONModel from "sap/ui/model/json/JSONModel";

/**
 * @namespace com.ndbs.skillreportingui.controller
 */
export default class TeamSkills extends BaseController implements IPage {

    public onInit(): void {
        const page = new PageCL<TeamSkills>(this, Routes.TEAM_SKILLS);
        page.initialize();
    }

    public async onObjectMatched(): Promise<void> {
        this.getComponentModel()?.attachRequestFailed({}, this.onODataRequestFail, this);
        await this.loadGroupedTeamSkills();
    }

    public onSearch(event: any): void {
        const query = event.getParameter("query") ?? event.getSource()?.getValue() ?? "";
        this.loadGroupedTeamSkills(query);
    }

    private getCategoryIcon(catName: string): string {
        const lower = (catName || "").toLowerCase();
        if (lower.includes("cloud")) return "sap-icon://cloud";
        if (lower.includes("program") || lower.includes("lang")) return "sap-icon://coding-model";
        if (lower.includes("data") || lower.includes("db")) return "sap-icon://database";
        if (lower.includes("devops") || lower.includes("tool")) return "sap-icon://process";
        if (lower.includes("soft") || lower.includes("manage") || lower.includes("lead")) return "sap-icon://group";
        if (lower.includes("sap")) return "sap-icon://sys-enter-2";
        return "sap-icon://education";
    }

    public async loadGroupedTeamSkills(searchQuery?: string): Promise<void> {
        const view = this.getView();
        if (!view) return;

        view.setBusy(true);
        try {
            const response = await fetch("/odata/v2/analytics/VTeamSkills?$format=json&$orderby=categoryName asc,employeeName asc");
            if (response.ok) {
                const data = await response.json();
                const results: any[] = data.d?.results || data.value || [];

                let filtered = results;
                if (searchQuery && searchQuery.trim() !== "") {
                    const q = searchQuery.toLowerCase().trim();
                    filtered = results.filter((r: any) =>
                        (r.employeeName && r.employeeName.toLowerCase().includes(q)) ||
                        (r.skillName && r.skillName.toLowerCase().includes(q)) ||
                        (r.categoryName && r.categoryName.toLowerCase().includes(q)) ||
                        (r.departmentName && r.departmentName.toLowerCase().includes(q))
                    );
                }

                // Calculate overall KPIs
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
                    const pendingInGroup = skillsInGroup.filter((s: any) => s.validationStatus === "selfDeclared" || s.validationStatus === "draft").length;

                    return {
                        categoryName: catName,
                        icon: this.getCategoryIcon(catName),
                        count: skillsInGroup.length,
                        pendingCount: pendingInGroup,
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
            console.error("Failed to load team skills", error);
        } finally {
            view.setBusy(false);
        }
    }

    public onRowEndorse(event: any): void {
        const button = event.getSource() as Button;
        const context = button.getBindingContext("groupedSkillsModel") as Context;
        if (!context) return;

        const employeeSkillID = context.getProperty("ID");
        const employeeName = context.getProperty("employeeName");
        const skillName = context.getProperty("skillName");

        MessageBox.confirm(`Endorse skill '${skillName}' for ${employeeName}?`, {
            onClose: async (action: string) => {
                if (action === MessageBox.Action.OK) {
                    try {
                        const response = await fetch("/odata/v2/analytics/endorseSkill", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ employeeSkillID, validationStatus: "managerValidated" })
                        });
                        if (response.ok) {
                            MessageBox.success(`Skill '${skillName}' has been validated!`);
                            await this.loadGroupedTeamSkills();
                        } else {
                            MessageBox.error("Failed to endorse skill.");
                        }
                    } catch {
                        MessageBox.error("Failed to endorse skill due to technical error.");
                    }
                }
            }
        });
    }

    public onODataRequestFail(_event: Model$RequestFailedEvent): void {
        this.openMessagePopover();
    }
}
