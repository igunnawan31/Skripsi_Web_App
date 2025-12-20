export function getYearsFromContract(
    startDate: string,
    endDate: string
): number[] {
    const startYear = new Date(startDate).getFullYear();
    const endYear = new Date(endDate).getFullYear();

    const years: number[] = [];
    for (let y = startYear; y <= endYear; y++) {
        years.push(y);
    }

    return years;
}

export function getMonthsFromContract(
    year: number,
    startDate: string,
    endDate: string
) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const months: number[] = [];

    const startMonth =
        year === start.getFullYear() ? start.getMonth() : 0;

    const endMonth =
        year === end.getFullYear() ? end.getMonth() : 11;

    for (let m = startMonth; m <= endMonth; m++) {
        months.push(m);
    }

    return months;
}