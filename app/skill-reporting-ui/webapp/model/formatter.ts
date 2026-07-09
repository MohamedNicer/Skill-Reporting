import BaseController from "com/ndbs/skillreportingui/controller/BaseController";

export default {
    getEngagementState: function (state: string): string {
        let objectState = "Success";

        switch (state) {
            case "1":
                objectState = "Success";
                break;
            case "2":
                objectState = "Information";
                break;
            case "3":
                objectState = "None";
                break;
            case "4":
                objectState = "Error";
                break;
        }

        return objectState;
    },

    getDocumentTypeText: function (documentType: "ATTC" | "LOGO" | "ISE"): string {
        switch (documentType) {
            case "ISE":
                return (this as unknown as BaseController).getResourceBundleText("iseAgreement");
            case "LOGO":
                return (this as unknown as BaseController).getResourceBundleText("logo");
            default:
                return (this as unknown as BaseController).getResourceBundleText("attachment");
        }
    },

    getDocumentTypeState: function (documentType: "ATTC" | "LOGO" | "ISE"): string {
        switch (documentType) {
            case "ISE":
                return "Indication04";
            case "LOGO":
                return "Indication03";
            default:
                return "Indication07";
        }
    },

    getColumnChartColor: function (hours: string) {
        return parseInt(hours) > 40 ? "Good" : "Error";
    },

    getBulletChartColor: function (budget: string, hours: string) {
        return parseFloat(hours) > parseFloat(budget) ? "Error" : "Good";
    },

    convertToFloat: function (value: string): number {
        return parseFloat(value);
    }
} 