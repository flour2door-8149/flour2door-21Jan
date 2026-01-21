import * as XLSX from 'xlsx'

export function exportOrdersToExcel(orders) {
    const data = orders.map(order => ({
        'Order Number': order.orderNumber,
        'Date': new Date(order.createdAt).toLocaleDateString('en-IN'),
        'Customer Name': order.address?.name || order.user?.name,
        'Customer Phone': order.address?.phone || '',
        'Customer Email': order.user?.email || '',
        'Delivery Address': `${order.address?.street}, ${order.address?.city}, ${order.address?.state} - ${order.address?.zip}`,
        'Items': order.orderItems.map(item => 
            `${item.product.name} (${item.quantity})`
        ).join(', '),
        'Total Items': order.orderItems.reduce((sum, item) => sum + item.quantity, 0),
        'Subtotal': order.orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        'Discount': order.isCouponUsed ? order.coupon?.discount + '%' : '0%',
        'Total Amount': order.total,
        'Payment Method': order.paymentMethod,
        'Payment Status': order.isPaid ? 'PAID' : 'PENDING',
        'Order Status': order.status,
        'Rejection Reason': order.rejectionReason || '-'
    }))

    const worksheet = XLSX.utils.json_to_sheet(data)
    
    // Set column widths
    worksheet['!cols'] = [
        { wch: 15 }, // Order Number
        { wch: 12 }, // Date
        { wch: 20 }, // Customer Name
        { wch: 15 }, // Phone
        { wch: 25 }, // Email
        { wch: 40 }, // Address
        { wch: 50 }, // Items
        { wch: 10 }, // Total Items
        { wch: 12 }, // Subtotal
        { wch: 10 }, // Discount
        { wch: 12 }, // Total
        { wch: 12 }, // Payment Method
        { wch: 12 }, // Payment Status
        { wch: 15 }, // Status
        { wch: 30 }  // Rejection Reason
    ]

    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders')
    
    const date = new Date().toISOString().split('T')[0]
    XLSX.writeFile(workbook, `Flour2Door-Orders-${date}.xlsx`)
}

export function exportProductsToExcel(products) {
    const data = products.map(product => ({
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
        'Average Rating': product.rating?.length > 0 
            ? (product.rating.reduce((sum, r) => sum + r.rating, 0) / product.rating.length).toFixed(1)
            : '0',
        'Created Date': new Date(product.createdAt).toLocaleDateString('en-IN')
    }))

    const worksheet = XLSX.utils.json_to_sheet(data)
    
    worksheet['!cols'] = [
        { wch: 15 }, { wch: 25 }, { wch: 50 }, { wch: 12 },
        { wch: 10 }, { wch: 12 }, { wch: 10 }, { wch: 10 },
        { wch: 10 }, { wch: 12 }, { wch: 12 }, { wch: 12 }
    ]

    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Products')
    
    const date = new Date().toISOString().split('T')[0]
    XLSX.writeFile(workbook, `Flour2Door-Products-${date}.xlsx`)
}

export function exportAnalyticsToExcel(analyticsData) {
    // Summary Sheet
    const summary = [{
        'Metric': 'Total Revenue',
        'Value': analyticsData.totalRevenue
    }, {
        'Metric': 'Total Orders',
        'Value': analyticsData.totalOrders
    }, {
        'Metric': 'Total Products',
        'Value': analyticsData.totalProducts
    }, {
        'Metric': 'Total Customers',
        'Value': analyticsData.totalCustomers
    }]

    const summarySheet = XLSX.utils.json_to_sheet(summary)

    // Sales by Day Sheet
    const salesSheet = XLSX.utils.json_to_sheet(analyticsData.salesByDay)

    // Top Products Sheet
    const productsSheet = XLSX.utils.json_to_sheet(analyticsData.topProducts)

    // Create workbook with multiple sheets
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary')
    XLSX.utils.book_append_sheet(workbook, salesSheet, 'Daily Sales')
    XLSX.utils.book_append_sheet(workbook, productsSheet, 'Top Products')
    
    const date = new Date().toISOString().split('T')[0]
    XLSX.writeFile(workbook, `Flour2Door-Analytics-${date}.xlsx`)
}