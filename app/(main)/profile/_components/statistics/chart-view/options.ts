import type { ApexOptions } from "apexcharts";

const monthsLabels: Record<string, Record<string, string>> = {
  en: {
    '01': 'Jan', '02': 'Feb', '03': 'Mar', '04': 'Apr', '05': 'May', '06': 'Jun',
    '07': 'Jul', '08': 'Aug', '09': 'Sep', '10': 'Oct', '11': 'Nov', '12': 'Dec',
  },
  ru: {
    '01': 'Янв', '02': 'Фев', '03': 'Мар', '04': 'Апр', '05': 'Май', '06': 'Июн',
    '07': 'Июл', '08': 'Авг', '09': 'Сен', '10': 'Окт', '11': 'Ноя', '12': 'Дек',
  },
};

const getMonthName = (dateStr: string | undefined, lng: string): string => {
  if (!dateStr) {
    return '';
  }

  const monthNum = dateStr.split('.')[1];
  return monthsLabels[lng]?.[monthNum] || monthsLabels.en[monthNum] || '';
};

export const buildOptions = (
  categories: string[],
  theme: 'light' | 'dark',
  id: string,
  type: 'line' | 'bar',
  lng: string = 'en',
): ApexOptions => {
  const firstMonth = getMonthName(categories[0], lng);
  const lastMonth = getMonthName(categories.at(-1), lng);
  const firstDate = type === "line" ? categories[0].split(".")[0] : categories[0];
  const lastDate = type === "line" ? categories[categories.length - 1].split(".")[0] : categories.at(-1);

  return {
    chart: {
      toolbar: { show: false },
      background: 'transparent',
      id: id,
      type: type,
    },
    colors: ["var(--chart-primary)"],
    plotOptions: {
      bar: {
        columnWidth: '80%',
        borderRadius: 4,
      },
    },
    stroke: {
      curve: 'straight',
      width: 3,
    },
    fill: {
      opacity: 1,
    },
    grid: {
      borderColor: 'var(--chart-primary)',
      padding: {
        right: 50,
        left: 20,
      },
    },
    xaxis: {
      type: 'category',
      categories,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        style: {
          colors: 'var(--color-muted)',
        },
        formatter: function (value) {
          if (!value) {
            return '';
          }

          return String(value).substring(0, 2);
        },
      },
    },
    yaxis: {
      tickAmount: 5,
      min: 0,
      max: (maxValue) => {
        return Math.max(10, maxValue * 1.5);
      },
      labels: {
        formatter: function (val) {
          return val.toFixed(0);
        },
        style: {
          colors: 'var(--color-muted)',
        },
      },
    },
    dataLabels: { enabled: false },
    theme: { mode: theme },
    annotations: {
      xaxis: [
        {
          x: firstDate,
          borderColor: 'transparent',
          label: {
            text: firstMonth,
            position: 'bottom',
            orientation: 'horizontal',
            offsetY: 26,
            offsetX: -30,
            borderWidth: 0,
            style: { color: 'var(--color-muted)', fontSize: '12px', fontWeight: 'bold', background: "none" },
          },
        },
        {
          x: lastDate,
          borderColor: 'transparent',
          label: {
            text: lastMonth,
            position: 'bottom',
            orientation: 'horizontal',
            offsetY: 26,
            offsetX: 30,
            borderWidth: 0,
            style: { color: 'var(--color-muted)', fontSize: '12px', fontWeight: 'bold', background: "none" },
          },
        },
      ],
    },
  };
};
