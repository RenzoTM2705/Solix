// Genera exportaciones PDF para reportes de tablas financieras.
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface TableColumn {
    header: string;
    key: string;
    width?: number;
}

export const generatePDF = (
    title: string,
    columns: TableColumn[],
    rows: any[],
    filename: string
) => {
    const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
    });

    const timestamp = new Date().toLocaleDateString("es-PE", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });

    // Encabezado
    doc.setFontSize(16);
    doc.text(title, 15, 15);
    doc.setFontSize(10);
    doc.text(`Generado: ${timestamp}`, 15, 22);

    // Tabla
    const tableData = rows.map((row) =>
        columns.map((col) => {
            const value = row[col.key];
            if (value === null || value === undefined) return "";
            if (typeof value === "number") {
                return value.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                });
            }
            return String(value);
        })
    );

    autoTable(doc, {
        head: [columns.map((col) => col.header)],
        body: tableData,
        startY: 30,
        margin: { top: 30, bottom: 10, left: 15, right: 15 },
        columnStyles: columns.reduce(
            (acc, col, idx) => {
                acc[idx] = {
                    cellWidth: col.width || "auto",
                    halign: col.key.includes("monto") || col.key.includes("amount") ? "right" : "left",
                };
                return acc;
            },
            {} as any
        ),
        theme: "grid",
        headStyles: {
            fillColor: [0, 61, 155],
            textColor: [255, 255, 255],
            fontStyle: "bold",
        },
        bodyStyles: {
            textColor: [19, 27, 46],
        },
        alternateRowStyles: {
            fillColor: [242, 243, 255],
        },
    });

    doc.save(`${filename}_${Date.now()}.pdf`);
};
