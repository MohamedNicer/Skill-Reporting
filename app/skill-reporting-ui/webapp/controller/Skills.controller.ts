import BaseController from "com/ndbs/skillreportingui/controller/BaseController";
import { IPage } from "../util/common/common.types";
import PageCL from "com/ndbs/skillreportingui/util/common/PageCL";
import { Routes } from "../types/global.types";
import { Model$RequestFailedEvent } from "sap/ui/model/Model";
import JSONModel from "sap/ui/model/json/JSONModel";

/**
 * @namespace com.ndbs.skillreportingui.controller
 */
export default class Skills extends BaseController implements IPage {

    public onInit(): void {
        const page = new PageCL<Skills>(this, Routes.SKILLS);
        page.initialize();
    }

    public async onObjectMatched(): Promise<void> {
        this.getComponentModel()?.attachRequestFailed({}, this.onODataRequestFail, this);
        await this.loadGroupedSkills();
    }

    public onSearch(event: any): void {
        const query = event.getParameter("query") ?? event.getSource()?.getValue() ?? "";
        this.loadGroupedSkills(query);
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

    public async loadGroupedSkills(searchQuery?: string): Promise<void> {
        const view = this.getView();
        if (!view) return;

        view.setBusy(true);
        try {
            const response = await fetch("/odata/v2/catalog/VSkills?$format=json&$orderby=categoryName asc,canonicalName asc");
            if (response.ok) {
                const data = await response.json();
                const results: any[] = data.d?.results || data.value || [];

                let filtered = results;
                if (searchQuery && searchQuery.trim() !== "") {
                    const q = searchQuery.toLowerCase().trim();
                    filtered = results.filter((r: any) =>
                        (r.canonicalName && r.canonicalName.toLowerCase().includes(q)) ||
                        (r.categoryName && r.categoryName.toLowerCase().includes(q)) ||
                        (r.description && r.description.toLowerCase().includes(q))
                    );
                }

                let approvedCount = 0;
                filtered.forEach((r: any) => {
                    if (r.status === "approved" || r.status === "Approved") {
                        approvedCount++;
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
                    approvedCount,
                    categoriesCount: categories.length
                });
            }
        } catch (error) {
            console.error("Failed to load skill catalog", error);
        } finally {
            view.setBusy(false);
        }
    }

    public onODataRequestFail(_event: Model$RequestFailedEvent): void {
        this.openMessagePopover();
    }
}