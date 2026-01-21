module.exports = [
"[externals]/worker_threads [external] (worker_threads, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("worker_threads", () => require("worker_threads"));

module.exports = mod;
}),
"[project]/lib/pdf/invoiceGenerator.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "downloadInvoice",
    ()=>downloadInvoice,
    "generateInvoice",
    ()=>generateInvoice,
    "printInvoice",
    ()=>printInvoice
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jspdf$2f$dist$2f$jspdf$2e$node$2e$min$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jspdf/dist/jspdf.node.min.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jspdf$2d$autotable$2f$dist$2f$jspdf$2e$plugin$2e$autotable$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jspdf-autotable/dist/jspdf.plugin.autotable.mjs [app-ssr] (ecmascript)");
;
;
function generateInvoice(order, storeInfo) {
    const doc = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jspdf$2f$dist$2f$jspdf$2e$node$2e$min$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]();
    const currency = '₹';
    // Header - Company Branding
    doc.setFillColor(34, 139, 34); // Green
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.text('Flour2Door', 105, 20, {
        align: 'center'
    });
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Fresh Flour, Delivered to Your Door', 105, 30, {
        align: 'center'
    });
    // Reset text color
    doc.setTextColor(0, 0, 0);
    // Invoice Title
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('TAX INVOICE', 105, 55, {
        align: 'center'
    });
    // Invoice Info
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Invoice No: ${order.orderNumber}`, 20, 70);
    doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString('en-IN')}`, 20, 76);
    doc.text(`Payment: ${order.isPaid ? 'PAID' : 'COD'}`, 20, 82);
    // Store & Customer Details Side by Side
    // Store Details (Left)
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('From:', 20, 95);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(storeInfo.name, 20, 102);
    doc.text(storeInfo.address.substring(0, 40), 20, 108);
    if (storeInfo.address.length > 40) {
        doc.text(storeInfo.address.substring(40, 80), 20, 114);
    }
    doc.text(`Email: ${storeInfo.email}`, 20, 120);
    doc.text(`Phone: ${storeInfo.contact}`, 20, 126);
    // Customer Details (Right)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('Bill To:', 120, 95);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(order.address.name, 120, 102);
    doc.text(order.address.street, 120, 108);
    doc.text(`${order.address.city}, ${order.address.state}`, 120, 114);
    doc.text(`${order.address.zip}`, 120, 120);
    doc.text(`Phone: ${order.address.phone}`, 120, 126);
    // Items Table
    const tableData = order.orderItems.map((item)=>[
            item.product.name,
            item.quantity.toString(),
            `${currency}${item.price.toFixed(2)}`,
            `${currency}${(item.price * item.quantity).toFixed(2)}`
        ]);
    doc.autoTable({
        startY: 140,
        head: [
            [
                'Item',
                'Qty',
                'Price',
                'Total'
            ]
        ],
        body: tableData,
        theme: 'striped',
        headStyles: {
            fillColor: [
                34,
                139,
                34
            ],
            textColor: 255,
            fontStyle: 'bold'
        },
        styles: {
            fontSize: 10,
            cellPadding: 5
        },
        columnStyles: {
            0: {
                cellWidth: 90
            },
            1: {
                cellWidth: 30,
                halign: 'center'
            },
            2: {
                cellWidth: 35,
                halign: 'right'
            },
            3: {
                cellWidth: 35,
                halign: 'right'
            }
        }
    });
    // Totals
    const finalY = doc.lastAutoTable.finalY + 10;
    const subtotal = order.orderItems.reduce((sum, item)=>sum + item.price * item.quantity, 0);
    doc.setFontSize(10);
    doc.text('Subtotal:', 140, finalY);
    doc.text(`${currency}${subtotal.toFixed(2)}`, 190, finalY, {
        align: 'right'
    });
    if (order.isCouponUsed && order.coupon) {
        const discount = subtotal * order.coupon.discount / 100;
        doc.text(`Discount (${order.coupon.discount}%):`, 140, finalY + 6);
        doc.text(`-${currency}${discount.toFixed(2)}`, 190, finalY + 6, {
            align: 'right'
        });
    }
    // Grand Total
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    const grandTotalY = order.isCouponUsed ? finalY + 12 : finalY + 6;
    doc.text('Grand Total:', 140, grandTotalY);
    doc.text(`${currency}${order.total.toFixed(2)}`, 190, grandTotalY, {
        align: 'right'
    });
    // Footer
    doc.setFontSize(9);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(100, 100, 100);
    const footerY = 270;
    doc.text('Thank you for shopping with Flour2Door!', 105, footerY, {
        align: 'center'
    });
    doc.text('For queries: contact@flour2door.com | +91 8149090936', 105, footerY + 5, {
        align: 'center'
    });
    return doc;
}
function downloadInvoice(order, storeInfo) {
    const doc = generateInvoice(order, storeInfo);
    doc.save(`Invoice-${order.orderNumber}.pdf`);
}
function printInvoice(order, storeInfo) {
    const doc = generateInvoice(order, storeInfo);
    doc.autoPrint();
    window.open(doc.output('bloburl'), '_blank');
}
}),
"[project]/lib/pdf/packingSlipGenerator.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "generatePackingSlip",
    ()=>generatePackingSlip,
    "printPackingSlip",
    ()=>printPackingSlip
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jspdf$2f$dist$2f$jspdf$2e$node$2e$min$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jspdf/dist/jspdf.node.min.js [app-ssr] (ecmascript)");
;
function generatePackingSlip(order, storeInfo) {
    // Small format: 100mm x 150mm (thermal printer size)
    const doc = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jspdf$2f$dist$2f$jspdf$2e$node$2e$min$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]({
        orientation: 'portrait',
        unit: 'mm',
        format: [
            100,
            150
        ]
    });
    const currency = '₹';
    // Border
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    doc.rect(2, 2, 96, 146);
    // Header with Branding
    doc.setFillColor(34, 139, 34); // Green
    doc.rect(2, 2, 96, 20, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Flour2Door', 50, 10, {
        align: 'center'
    });
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('Fresh & Organic', 50, 16, {
        align: 'center'
    });
    // Reset colors
    doc.setTextColor(0, 0, 0);
    // Order Number (Prominent)
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(order.orderNumber, 50, 30, {
        align: 'center'
    });
    // Delivery To Section
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text('DELIVER TO:', 5, 40);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(order.address.name, 5, 46);
    doc.setFontSize(8);
    const address = doc.splitTextToSize(`${order.address.street}, ${order.address.city}, ${order.address.state} - ${order.address.zip}`, 90);
    doc.text(address, 5, 52);
    // Phone (Large for visibility)
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(`📞 ${order.address.phone}`, 5, 68);
    // Horizontal Line
    doc.setLineWidth(0.3);
    doc.line(5, 72, 95, 72);
    // Items Section
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text('ITEMS:', 5, 78);
    doc.setFont('helvetica', 'normal');
    let itemY = 84;
    order.orderItems.forEach((item, index)=>{
        if (itemY > 120) return; // Space limit
        const itemText = `${index + 1}. ${item.product.name} × ${item.quantity}`;
        doc.text(itemText, 5, itemY);
        itemY += 5;
    });
    // Total Amount (Highlighted)
    doc.setFillColor(240, 240, 240);
    doc.rect(5, itemY + 5, 90, 10, 'F');
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('TOTAL:', 7, itemY + 11);
    doc.text(`${currency}${order.total.toFixed(2)}`, 93, itemY + 11, {
        align: 'right'
    });
    // Payment Status
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    const paymentStatus = order.isPaid ? 'PAID ✓' : 'COD';
    doc.text(`Payment: ${paymentStatus}`, 5, itemY + 18);
    // Footer
    doc.setFontSize(7);
    doc.setTextColor(100, 100, 100);
    doc.text('Thank you for choosing Flour2Door!', 50, 145, {
        align: 'center'
    });
    return doc;
}
function printPackingSlip(order, storeInfo) {
    const doc = generatePackingSlip(order, storeInfo);
    doc.autoPrint();
    window.open(doc.output('bloburl'), '_blank');
}
}),
"[project]/lib/export/excelExport.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "exportAnalyticsToExcel",
    ()=>exportAnalyticsToExcel,
    "exportOrdersToExcel",
    ()=>exportOrdersToExcel,
    "exportProductsToExcel",
    ()=>exportProductsToExcel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/xlsx/xlsx.mjs [app-ssr] (ecmascript)");
;
function exportOrdersToExcel(orders) {
    const data = orders.map((order)=>({
            'Order Number': order.orderNumber,
            'Date': new Date(order.createdAt).toLocaleDateString('en-IN'),
            'Customer Name': order.address?.name || order.user?.name,
            'Customer Phone': order.address?.phone || '',
            'Customer Email': order.user?.email || '',
            'Delivery Address': `${order.address?.street}, ${order.address?.city}, ${order.address?.state} - ${order.address?.zip}`,
            'Items': order.orderItems.map((item)=>`${item.product.name} (${item.quantity})`).join(', '),
            'Total Items': order.orderItems.reduce((sum, item)=>sum + item.quantity, 0),
            'Subtotal': order.orderItems.reduce((sum, item)=>sum + item.price * item.quantity, 0),
            'Discount': order.isCouponUsed ? order.coupon?.discount + '%' : '0%',
            'Total Amount': order.total,
            'Payment Method': order.paymentMethod,
            'Payment Status': order.isPaid ? 'PAID' : 'PENDING',
            'Order Status': order.status,
            'Rejection Reason': order.rejectionReason || '-'
        }));
    const worksheet = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["utils"].json_to_sheet(data);
    // Set column widths
    worksheet['!cols'] = [
        {
            wch: 15
        },
        {
            wch: 12
        },
        {
            wch: 20
        },
        {
            wch: 15
        },
        {
            wch: 25
        },
        {
            wch: 40
        },
        {
            wch: 50
        },
        {
            wch: 10
        },
        {
            wch: 12
        },
        {
            wch: 10
        },
        {
            wch: 12
        },
        {
            wch: 12
        },
        {
            wch: 12
        },
        {
            wch: 15
        },
        {
            wch: 30
        } // Rejection Reason
    ];
    const workbook = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["utils"].book_new();
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["utils"].book_append_sheet(workbook, worksheet, 'Orders');
    const date = new Date().toISOString().split('T')[0];
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["writeFile"](workbook, `Flour2Door-Orders-${date}.xlsx`);
}
function exportProductsToExcel(products) {
    const data = products.map((product)=>({
            'Product ID': product.id,
            'Name': product.name,
            'Description': product.description,
            'Category': product.category,
            'MRP': product.mrp,
            'Selling Price': product.price,
            'Discount %': ((product.mrp - product.price) / product.mrp * 100).toFixed(2),
            'Stock Quantity': product.stock,
            'Status': product.inStock ? 'Active' : 'Inactive',
            'Total Ratings': product.rating?.length || 0,
            'Average Rating': product.rating?.length > 0 ? (product.rating.reduce((sum, r)=>sum + r.rating, 0) / product.rating.length).toFixed(1) : '0',
            'Created Date': new Date(product.createdAt).toLocaleDateString('en-IN')
        }));
    const worksheet = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["utils"].json_to_sheet(data);
    worksheet['!cols'] = [
        {
            wch: 15
        },
        {
            wch: 25
        },
        {
            wch: 50
        },
        {
            wch: 12
        },
        {
            wch: 10
        },
        {
            wch: 12
        },
        {
            wch: 10
        },
        {
            wch: 10
        },
        {
            wch: 10
        },
        {
            wch: 12
        },
        {
            wch: 12
        },
        {
            wch: 12
        }
    ];
    const workbook = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["utils"].book_new();
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["utils"].book_append_sheet(workbook, worksheet, 'Products');
    const date = new Date().toISOString().split('T')[0];
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["writeFile"](workbook, `Flour2Door-Products-${date}.xlsx`);
}
function exportAnalyticsToExcel(analyticsData) {
    // Summary Sheet
    const summary = [
        {
            'Metric': 'Total Revenue',
            'Value': analyticsData.totalRevenue
        },
        {
            'Metric': 'Total Orders',
            'Value': analyticsData.totalOrders
        },
        {
            'Metric': 'Total Products',
            'Value': analyticsData.totalProducts
        },
        {
            'Metric': 'Total Customers',
            'Value': analyticsData.totalCustomers
        }
    ];
    const summarySheet = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["utils"].json_to_sheet(summary);
    // Sales by Day Sheet
    const salesSheet = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["utils"].json_to_sheet(analyticsData.salesByDay);
    // Top Products Sheet
    const productsSheet = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["utils"].json_to_sheet(analyticsData.topProducts);
    // Create workbook with multiple sheets
    const workbook = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["utils"].book_new();
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["utils"].book_append_sheet(workbook, summarySheet, 'Summary');
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["utils"].book_append_sheet(workbook, salesSheet, 'Daily Sales');
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["utils"].book_append_sheet(workbook, productsSheet, 'Top Products');
    const date = new Date().toISOString().split('T')[0];
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["writeFile"](workbook, `Flour2Door-Analytics-${date}.xlsx`);
}
}),
"[project]/app/store/orders/page.jsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>StoreOrdersEnhanced
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/bell.js [app-ssr] (ecmascript) <export default as Bell>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/download.js [app-ssr] (ecmascript) <export default as Download>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/eye.js [app-ssr] (ecmascript) <export default as Eye>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-ssr] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$pdf$2f$invoiceGenerator$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/pdf/invoiceGenerator.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$pdf$2f$packingSlipGenerator$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/pdf/packingSlipGenerator.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$export$2f$excelExport$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/export/excelExport.js [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
function StoreOrdersEnhanced() {
    const [orders, setOrders] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [selectedOrder, setSelectedOrder] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isModalOpen, setIsModalOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [rejectReason, setRejectReason] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [showRejectModal, setShowRejectModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [filter, setFilter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('all');
    const [notification, setNotification] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const currency = '$';
    const orderStatuses = {
        'ORDER_PLACED': {
            label: 'Order Placed',
            color: 'bg-blue-100 text-blue-800'
        },
        'ACCEPTED': {
            label: 'Accepted',
            color: 'bg-green-100 text-green-800'
        },
        'PROCESSING': {
            label: 'Processing',
            color: 'bg-yellow-100 text-yellow-800'
        },
        'READY_FOR_PICKUP': {
            label: 'Ready for Pickup',
            color: 'bg-purple-100 text-purple-800'
        },
        'OUT_FOR_DELIVERY': {
            label: 'Out for Delivery',
            color: 'bg-indigo-100 text-indigo-800'
        },
        'DELIVERED': {
            label: 'Delivered',
            color: 'bg-green-100 text-green-800'
        },
        'REJECTED': {
            label: 'Rejected',
            color: 'bg-red-100 text-red-800'
        },
        'REFUND_INITIATED': {
            label: 'Refund Initiated',
            color: 'bg-orange-100 text-orange-800'
        },
        'REFUNDED': {
            label: 'Refunded',
            color: 'bg-gray-100 text-gray-800'
        }
    };
    const fetchOrders = async ()=>{
        setLoading(true);
        // Mock data
        const mockOrders = [
            {
                id: '1',
                orderNumber: 'ORD-2025-001',
                customer: {
                    name: 'John Doe',
                    phone: '+91 9876543210',
                    email: 'john@example.com'
                },
                total: 450,
                paymentMethod: 'STRIPE',
                isPaid: true,
                status: 'ORDER_PLACED',
                createdAt: new Date().toISOString(),
                address: {
                    name: 'John Doe',
                    street: '123 Main St',
                    city: 'Mumbai',
                    state: 'Maharashtra',
                    zip: '400001',
                    phone: '+91 9876543210'
                },
                orderItems: [
                    {
                        product: {
                            name: 'Wheat Flour',
                            images: [
                                'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=150'
                            ]
                        },
                        quantity: 2,
                        price: 90
                    },
                    {
                        product: {
                            name: 'Jowar Flour',
                            images: [
                                'https://images.unsplash.com/photo-1599909533253-85f5e1c29ff1?w=150'
                            ]
                        },
                        quantity: 3,
                        price: 90
                    }
                ]
            }
        ];
        setOrders(mockOrders);
        setLoading(false);
    };
    const playNotificationSound = ()=>{
        // Notification sound would play here
        setNotification(true);
        setTimeout(()=>setNotification(false), 3000);
    };
    const updateOrderStatus = async (orderId, status)=>{
        setOrders((prev)=>prev.map((order)=>order.id === orderId ? {
                    ...order,
                    status
                } : order));
    };
    const acceptOrder = async (orderId)=>{
        await updateOrderStatus(orderId, 'ACCEPTED');
        // Generate invoice here
        alert('Order accepted! Invoice generated.');
    };
    const rejectOrder = async (orderId, reason)=>{
        setOrders((prev)=>prev.map((order)=>order.id === orderId ? {
                    ...order,
                    status: 'REJECTED',
                    rejectionReason: reason
                } : order));
        setShowRejectModal(null);
        setRejectReason('');
        alert('Order rejected. Refund will be initiated.');
    };
    const generateInvoice = (order)=>{
        // Generate invoice PDF
        alert(`Generating invoice for order ${order.orderNumber}`);
    };
    const downloadInvoice = (order)=>{
        // Download invoice
        alert(`Downloading invoice for order ${order.orderNumber}`);
    };
    const printPackingSlip = (order)=>{
        // Print packing slip
        const printContent = `
            <div style="font-family: Arial; padding: 20px;">
                <h2>Packing Slip - ${order.orderNumber}</h2>
                <p><strong>Customer:</strong> ${order.customer.name}</p>
                <p><strong>Phone:</strong> ${order.address.phone}</p>
                <p><strong>Address:</strong> ${order.address.street}, ${order.address.city}, ${order.address.state} - ${order.address.zip}</p>
                <hr/>
                <h3>Items:</h3>
                ${order.orderItems.map((item)=>`
                    <p>${item.product.name} x ${item.quantity} - ${currency}${item.price * item.quantity}</p>
                `).join('')}
                <hr/>
                <p><strong>Total:</strong> ${currency}${order.total}</p>
            </div>
        `;
        const printWindow = window.open('', '', 'width=800,height=600');
        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.print();
    };
    const openModal = (order)=>{
        setSelectedOrder(order);
        setIsModalOpen(true);
    };
    const closeModal = ()=>{
        setSelectedOrder(null);
        setIsModalOpen(false);
    };
    const filteredOrders = filter === 'all' ? orders : orders.filter((o)=>o.status === filter);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        fetchOrders();
        // Simulate new order notification
        const interval = setInterval(()=>{
        // Check for new orders
        }, 30000);
        return ()=>clearInterval(interval);
    }, []);
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center justify-center h-screen",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-11 h-11 rounded-full border-3 border-gray-300 border-t-green-500 animate-spin"
            }, void 0, false, {
                fileName: "[project]/app/store/orders/page.jsx",
                lineNumber: 170,
                columnNumber: 17
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/store/orders/page.jsx",
            lineNumber: 169,
            columnNumber: 13
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "mb-28",
        children: [
            notification && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed top-4 right-4 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 animate-bounce z-50",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__["Bell"], {
                        size: 24
                    }, void 0, false, {
                        fileName: "[project]/app/store/orders/page.jsx",
                        lineNumber: 180,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "font-semibold",
                                children: "New Order Received!"
                            }, void 0, false, {
                                fileName: "[project]/app/store/orders/page.jsx",
                                lineNumber: 182,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm",
                                children: "You have a new order to process"
                            }, void 0, false, {
                                fileName: "[project]/app/store/orders/page.jsx",
                                lineNumber: 183,
                                columnNumber: 25
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/store/orders/page.jsx",
                        lineNumber: 181,
                        columnNumber: 21
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/store/orders/page.jsx",
                lineNumber: 179,
                columnNumber: 17
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex justify-between items-center mb-5",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-2xl text-slate-500",
                        children: [
                            "Store ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-slate-800 font-medium",
                                children: "Orders"
                            }, void 0, false, {
                                fileName: "[project]/app/store/orders/page.jsx",
                                lineNumber: 190,
                                columnNumber: 27
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/store/orders/page.jsx",
                        lineNumber: 189,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-2 text-sm",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setFilter('all'),
                                className: `px-4 py-2 rounded ${filter === 'all' ? 'bg-slate-800 text-white' : 'bg-slate-100'}`,
                                children: "All"
                            }, void 0, false, {
                                fileName: "[project]/app/store/orders/page.jsx",
                                lineNumber: 195,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setFilter('ORDER_PLACED'),
                                className: `px-4 py-2 rounded ${filter === 'ORDER_PLACED' ? 'bg-slate-800 text-white' : 'bg-slate-100'}`,
                                children: "New Orders"
                            }, void 0, false, {
                                fileName: "[project]/app/store/orders/page.jsx",
                                lineNumber: 201,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setFilter('ACCEPTED'),
                                className: `px-4 py-2 rounded ${filter === 'ACCEPTED' ? 'bg-slate-800 text-white' : 'bg-slate-100'}`,
                                children: "Accepted"
                            }, void 0, false, {
                                fileName: "[project]/app/store/orders/page.jsx",
                                lineNumber: 207,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setFilter('DELIVERED'),
                                className: `px-4 py-2 rounded ${filter === 'DELIVERED' ? 'bg-slate-800 text-white' : 'bg-slate-100'}`,
                                children: "Delivered"
                            }, void 0, false, {
                                fileName: "[project]/app/store/orders/page.jsx",
                                lineNumber: 213,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/store/orders/page.jsx",
                        lineNumber: 194,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/store/orders/page.jsx",
                lineNumber: 188,
                columnNumber: 13
            }, this),
            filteredOrders.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-center text-slate-400 py-20",
                children: "No orders found"
            }, void 0, false, {
                fileName: "[project]/app/store/orders/page.jsx",
                lineNumber: 223,
                columnNumber: 17
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "overflow-x-auto rounded-lg shadow border border-gray-200",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                    className: "w-full text-sm text-left text-gray-600",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                            className: "bg-gray-50 text-gray-700 text-xs uppercase tracking-wider",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "px-4 py-3",
                                        children: "Order #"
                                    }, void 0, false, {
                                        fileName: "[project]/app/store/orders/page.jsx",
                                        lineNumber: 229,
                                        columnNumber: 33
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "px-4 py-3",
                                        children: "Customer"
                                    }, void 0, false, {
                                        fileName: "[project]/app/store/orders/page.jsx",
                                        lineNumber: 230,
                                        columnNumber: 33
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "px-4 py-3",
                                        children: "Items"
                                    }, void 0, false, {
                                        fileName: "[project]/app/store/orders/page.jsx",
                                        lineNumber: 231,
                                        columnNumber: 33
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "px-4 py-3",
                                        children: "Total"
                                    }, void 0, false, {
                                        fileName: "[project]/app/store/orders/page.jsx",
                                        lineNumber: 232,
                                        columnNumber: 33
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "px-4 py-3",
                                        children: "Payment"
                                    }, void 0, false, {
                                        fileName: "[project]/app/store/orders/page.jsx",
                                        lineNumber: 233,
                                        columnNumber: 33
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "px-4 py-3",
                                        children: "Status"
                                    }, void 0, false, {
                                        fileName: "[project]/app/store/orders/page.jsx",
                                        lineNumber: 234,
                                        columnNumber: 33
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "px-4 py-3",
                                        children: "Actions"
                                    }, void 0, false, {
                                        fileName: "[project]/app/store/orders/page.jsx",
                                        lineNumber: 235,
                                        columnNumber: 33
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/store/orders/page.jsx",
                                lineNumber: 228,
                                columnNumber: 29
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/store/orders/page.jsx",
                            lineNumber: 227,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                            className: "divide-y divide-gray-100",
                            children: filteredOrders.map((order)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                    className: "hover:bg-gray-50 transition-colors duration-150",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "px-4 py-3 font-medium text-slate-800",
                                            children: [
                                                order.orderNumber,
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-xs text-gray-500",
                                                    children: new Date(order.createdAt).toLocaleString()
                                                }, void 0, false, {
                                                    fileName: "[project]/app/store/orders/page.jsx",
                                                    lineNumber: 246,
                                                    columnNumber: 41
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/store/orders/page.jsx",
                                            lineNumber: 244,
                                            columnNumber: 37
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "px-4 py-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: order.customer.name
                                                }, void 0, false, {
                                                    fileName: "[project]/app/store/orders/page.jsx",
                                                    lineNumber: 251,
                                                    columnNumber: 41
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-xs text-gray-500",
                                                    children: order.customer.phone
                                                }, void 0, false, {
                                                    fileName: "[project]/app/store/orders/page.jsx",
                                                    lineNumber: 252,
                                                    columnNumber: 41
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/store/orders/page.jsx",
                                            lineNumber: 250,
                                            columnNumber: 37
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "px-4 py-3",
                                            children: [
                                                order.orderItems.length,
                                                " items"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/store/orders/page.jsx",
                                            lineNumber: 254,
                                            columnNumber: 37
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "px-4 py-3 font-medium text-slate-800",
                                            children: [
                                                currency,
                                                order.total
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/store/orders/page.jsx",
                                            lineNumber: 257,
                                            columnNumber: 37
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "px-4 py-3",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: `px-2 py-1 rounded text-xs ${order.isPaid ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`,
                                                children: order.isPaid ? 'Paid' : 'COD'
                                            }, void 0, false, {
                                                fileName: "[project]/app/store/orders/page.jsx",
                                                lineNumber: 261,
                                                columnNumber: 41
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/store/orders/page.jsx",
                                            lineNumber: 260,
                                            columnNumber: 37
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "px-4 py-3",
                                            children: order.status === 'ORDER_PLACED' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>acceptOrder(order.id),
                                                        className: "px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700",
                                                        children: "Accept"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/store/orders/page.jsx",
                                                        lineNumber: 268,
                                                        columnNumber: 49
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>setShowRejectModal(order.id),
                                                        className: "px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700",
                                                        children: "Reject"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/store/orders/page.jsx",
                                                        lineNumber: 274,
                                                        columnNumber: 49
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/store/orders/page.jsx",
                                                lineNumber: 267,
                                                columnNumber: 45
                                            }, this) : order.status === 'REJECTED' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: `px-3 py-1 rounded-full text-xs ${orderStatuses[order.status].color}`,
                                                        children: orderStatuses[order.status].label
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/store/orders/page.jsx",
                                                        lineNumber: 283,
                                                        columnNumber: 49
                                                    }, this),
                                                    order.rejectionReason && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-xs text-red-600 mt-1",
                                                        children: [
                                                            "Reason: ",
                                                            order.rejectionReason
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/store/orders/page.jsx",
                                                        lineNumber: 287,
                                                        columnNumber: 53
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/store/orders/page.jsx",
                                                lineNumber: 282,
                                                columnNumber: 45
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                value: order.status,
                                                onChange: (e)=>updateOrderStatus(order.id, e.target.value),
                                                className: "border border-gray-300 rounded-md text-xs px-2 py-1",
                                                children: Object.keys(orderStatuses).filter((s)=>s !== 'ORDER_PLACED' && s !== 'REJECTED').map((status)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: status,
                                                        children: orderStatuses[status].label
                                                    }, status, false, {
                                                        fileName: "[project]/app/store/orders/page.jsx",
                                                        lineNumber: 301,
                                                        columnNumber: 57
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/app/store/orders/page.jsx",
                                                lineNumber: 293,
                                                columnNumber: 45
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/store/orders/page.jsx",
                                            lineNumber: 265,
                                            columnNumber: 37
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "px-4 py-3",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>openModal(order),
                                                        className: "text-blue-600 hover:bg-blue-50 p-2 rounded",
                                                        title: "View Details",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__["Eye"], {
                                                            size: 18
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/store/orders/page.jsx",
                                                            lineNumber: 315,
                                                            columnNumber: 49
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/store/orders/page.jsx",
                                                        lineNumber: 310,
                                                        columnNumber: 45
                                                    }, this),
                                                    order.status !== 'ORDER_PLACED' && order.status !== 'REJECTED' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                onClick: ()=>downloadInvoice(order),
                                                                className: "text-green-600 hover:bg-green-50 p-2 rounded",
                                                                title: "Download Invoice",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__["Download"], {
                                                                    size: 18
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/store/orders/page.jsx",
                                                                    lineNumber: 324,
                                                                    columnNumber: 57
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/store/orders/page.jsx",
                                                                lineNumber: 319,
                                                                columnNumber: 53
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                onClick: ()=>printPackingSlip(order),
                                                                className: "text-purple-600 hover:bg-purple-50 p-2 rounded text-xs",
                                                                title: "Print Packing Slip",
                                                                children: "Print"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/store/orders/page.jsx",
                                                                lineNumber: 326,
                                                                columnNumber: 53
                                                            }, this)
                                                        ]
                                                    }, void 0, true)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/store/orders/page.jsx",
                                                lineNumber: 309,
                                                columnNumber: 41
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/store/orders/page.jsx",
                                            lineNumber: 308,
                                            columnNumber: 37
                                        }, this)
                                    ]
                                }, order.id, true, {
                                    fileName: "[project]/app/store/orders/page.jsx",
                                    lineNumber: 240,
                                    columnNumber: 33
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/app/store/orders/page.jsx",
                            lineNumber: 238,
                            columnNumber: 25
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/store/orders/page.jsx",
                    lineNumber: 226,
                    columnNumber: 21
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/store/orders/page.jsx",
                lineNumber: 225,
                columnNumber: 17
            }, this),
            isModalOpen && selectedOrder && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                onClick: closeModal,
                className: "fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    onClick: (e)=>e.stopPropagation(),
                    className: "bg-white rounded-lg shadow-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 relative m-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: closeModal,
                            className: "absolute top-4 right-4 text-gray-500 hover:text-gray-700",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                size: 24
                            }, void 0, false, {
                                fileName: "[project]/app/store/orders/page.jsx",
                                lineNumber: 358,
                                columnNumber: 29
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/store/orders/page.jsx",
                            lineNumber: 354,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "text-2xl font-semibold text-slate-900 mb-6",
                            children: [
                                "Order Details - ",
                                selectedOrder.orderNumber
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/store/orders/page.jsx",
                            lineNumber: 361,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mb-6 p-4 bg-slate-50 rounded-lg",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "font-semibold text-lg mb-3",
                                    children: "Customer Information"
                                }, void 0, false, {
                                    fileName: "[project]/app/store/orders/page.jsx",
                                    lineNumber: 367,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-2 gap-4 text-sm",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-gray-600",
                                                    children: "Name"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/store/orders/page.jsx",
                                                    lineNumber: 370,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "font-medium",
                                                    children: selectedOrder.customer.name
                                                }, void 0, false, {
                                                    fileName: "[project]/app/store/orders/page.jsx",
                                                    lineNumber: 371,
                                                    columnNumber: 37
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/store/orders/page.jsx",
                                            lineNumber: 369,
                                            columnNumber: 33
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-gray-600",
                                                    children: "Phone"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/store/orders/page.jsx",
                                                    lineNumber: 374,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "font-medium",
                                                    children: selectedOrder.customer.phone
                                                }, void 0, false, {
                                                    fileName: "[project]/app/store/orders/page.jsx",
                                                    lineNumber: 375,
                                                    columnNumber: 37
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/store/orders/page.jsx",
                                            lineNumber: 373,
                                            columnNumber: 33
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-gray-600",
                                                    children: "Email"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/store/orders/page.jsx",
                                                    lineNumber: 378,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "font-medium",
                                                    children: selectedOrder.customer.email
                                                }, void 0, false, {
                                                    fileName: "[project]/app/store/orders/page.jsx",
                                                    lineNumber: 379,
                                                    columnNumber: 37
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/store/orders/page.jsx",
                                            lineNumber: 377,
                                            columnNumber: 33
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-gray-600",
                                                    children: "Payment Status"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/store/orders/page.jsx",
                                                    lineNumber: 382,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: `font-medium ${selectedOrder.isPaid ? 'text-green-600' : 'text-yellow-600'}`,
                                                    children: selectedOrder.isPaid ? 'Paid' : 'COD'
                                                }, void 0, false, {
                                                    fileName: "[project]/app/store/orders/page.jsx",
                                                    lineNumber: 383,
                                                    columnNumber: 37
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/store/orders/page.jsx",
                                            lineNumber: 381,
                                            columnNumber: 33
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/store/orders/page.jsx",
                                    lineNumber: 368,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/store/orders/page.jsx",
                            lineNumber: 366,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mb-6 p-4 bg-slate-50 rounded-lg",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "font-semibold text-lg mb-3",
                                    children: "Delivery Address"
                                }, void 0, false, {
                                    fileName: "[project]/app/store/orders/page.jsx",
                                    lineNumber: 392,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm",
                                    children: [
                                        selectedOrder.address.street,
                                        ", ",
                                        selectedOrder.address.city,
                                        ",",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                            fileName: "[project]/app/store/orders/page.jsx",
                                            lineNumber: 394,
                                            columnNumber: 94
                                        }, this),
                                        selectedOrder.address.state,
                                        " - ",
                                        selectedOrder.address.zip
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/store/orders/page.jsx",
                                    lineNumber: 393,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/store/orders/page.jsx",
                            lineNumber: 391,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mb-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "font-semibold text-lg mb-3",
                                    children: "Order Items"
                                }, void 0, false, {
                                    fileName: "[project]/app/store/orders/page.jsx",
                                    lineNumber: 401,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-3",
                                    children: selectedOrder.orderItems.map((item, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-4 border border-slate-200 rounded-lg p-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                    src: item.product.images[0],
                                                    alt: item.product.name,
                                                    className: "w-16 h-16 object-cover rounded"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/store/orders/page.jsx",
                                                    lineNumber: 405,
                                                    columnNumber: 41
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex-1",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "font-medium",
                                                            children: item.product.name
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/store/orders/page.jsx",
                                                            lineNumber: 411,
                                                            columnNumber: 45
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-sm text-gray-600",
                                                            children: [
                                                                "Qty: ",
                                                                item.quantity,
                                                                " × ",
                                                                currency,
                                                                item.price
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/store/orders/page.jsx",
                                                            lineNumber: 412,
                                                            columnNumber: 45
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/store/orders/page.jsx",
                                                    lineNumber: 410,
                                                    columnNumber: 41
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "font-semibold",
                                                    children: [
                                                        currency,
                                                        item.price * item.quantity
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/store/orders/page.jsx",
                                                    lineNumber: 416,
                                                    columnNumber: 41
                                                }, this)
                                            ]
                                        }, i, true, {
                                            fileName: "[project]/app/store/orders/page.jsx",
                                            lineNumber: 404,
                                            columnNumber: 37
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/app/store/orders/page.jsx",
                                    lineNumber: 402,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/store/orders/page.jsx",
                            lineNumber: 400,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "border-t pt-4",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex justify-between items-center text-lg font-semibold",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "Total Amount"
                                    }, void 0, false, {
                                        fileName: "[project]/app/store/orders/page.jsx",
                                        lineNumber: 427,
                                        columnNumber: 33
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: [
                                            currency,
                                            selectedOrder.total
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/store/orders/page.jsx",
                                        lineNumber: 428,
                                        columnNumber: 33
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/store/orders/page.jsx",
                                lineNumber: 426,
                                columnNumber: 29
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/store/orders/page.jsx",
                            lineNumber: 425,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex gap-3 mt-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>printPackingSlip(selectedOrder),
                                    className: "flex-1 bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition",
                                    children: "Print Packing Slip"
                                }, void 0, false, {
                                    fileName: "[project]/app/store/orders/page.jsx",
                                    lineNumber: 434,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>downloadInvoice(selectedOrder),
                                    className: "flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition",
                                    children: "Download Invoice"
                                }, void 0, false, {
                                    fileName: "[project]/app/store/orders/page.jsx",
                                    lineNumber: 440,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/store/orders/page.jsx",
                            lineNumber: 433,
                            columnNumber: 25
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/store/orders/page.jsx",
                    lineNumber: 350,
                    columnNumber: 21
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/store/orders/page.jsx",
                lineNumber: 346,
                columnNumber: 17
            }, this),
            showRejectModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-white rounded-lg shadow-lg max-w-md w-full p-6 m-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            className: "text-xl font-semibold mb-4",
                            children: "Reject Order"
                        }, void 0, false, {
                            fileName: "[project]/app/store/orders/page.jsx",
                            lineNumber: 455,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-sm text-gray-600 mb-4",
                            children: "Please provide a reason for rejecting this order. This will be sent to the customer."
                        }, void 0, false, {
                            fileName: "[project]/app/store/orders/page.jsx",
                            lineNumber: 456,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                            value: rejectReason,
                            onChange: (e)=>setRejectReason(e.target.value),
                            className: "w-full border border-gray-300 rounded-lg p-3 mb-4",
                            rows: 4,
                            placeholder: "Enter rejection reason..."
                        }, void 0, false, {
                            fileName: "[project]/app/store/orders/page.jsx",
                            lineNumber: 459,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setShowRejectModal(null),
                                    className: "flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300",
                                    children: "Cancel"
                                }, void 0, false, {
                                    fileName: "[project]/app/store/orders/page.jsx",
                                    lineNumber: 467,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>rejectOrder(showRejectModal, rejectReason),
                                    disabled: !rejectReason.trim(),
                                    className: "flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed",
                                    children: "Reject Order"
                                }, void 0, false, {
                                    fileName: "[project]/app/store/orders/page.jsx",
                                    lineNumber: 473,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/store/orders/page.jsx",
                            lineNumber: 466,
                            columnNumber: 25
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/store/orders/page.jsx",
                    lineNumber: 454,
                    columnNumber: 21
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/store/orders/page.jsx",
                lineNumber: 453,
                columnNumber: 17
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/store/orders/page.jsx",
        lineNumber: 176,
        columnNumber: 9
    }, this);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__cf63a658._.js.map