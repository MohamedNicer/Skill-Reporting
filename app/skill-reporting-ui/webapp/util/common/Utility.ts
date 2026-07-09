import BaseObject from "sap/ui/base/Object";

export default class Utility extends BaseObject {
    public static formatDate(date: Date): string {
        const convertedDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
        return convertedDate.toISOString().substring(0, 10);
    }

    public static adaptTheTimezone(date: Date): Date {
        return new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
    }
}