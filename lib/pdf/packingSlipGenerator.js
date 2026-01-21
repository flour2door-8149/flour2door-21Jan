import jsPDF from 'jspdf'

export function generatePackingSlip(order, storeInfo) {
    // Small format: 100mm x 150mm (thermal printer size)
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [100, 150]
    })

    const currency = '₹'

    // Border
    doc.setDrawColor(0, 0, 0)
    doc.setLineWidth(0.5)
    doc.rect(2, 2, 96, 146)

    // Header with Branding
    doc.setFillColor(34, 139, 34) // Green
    doc.rect(2, 2, 96, 20, 'F')
    
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.text('Flour2Door', 50, 10, { align: 'center' })
    
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.text('Fresh & Organic', 50, 16, { align: 'center' })

    // Reset colors
    doc.setTextColor(0, 0, 0)

    // Order Number (Prominent)
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text(order.orderNumber, 50, 30, { align: 'center' })

    // Delivery To Section
    doc.setFontSize(8)
    doc.setFont('helvetica', 'bold')
    doc.text('DELIVER TO:', 5, 40)
    
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.text(order.address.name, 5, 46)
    
    doc.setFontSize(8)
    const address = doc.splitTextToSize(
        `${order.address.street}, ${order.address.city}, ${order.address.state} - ${order.address.zip}`,
        90
    )
    doc.text(address, 5, 52)

    // Phone (Large for visibility)
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.text(`📞 ${order.address.phone}`, 5, 68)

    // Horizontal Line
    doc.setLineWidth(0.3)
    doc.line(5, 72, 95, 72)

    // Items Section
    doc.setFontSize(8)
    doc.setFont('helvetica', 'bold')
    doc.text('ITEMS:', 5, 78)

    doc.setFont('helvetica', 'normal')
    let itemY = 84
    order.orderItems.forEach((item, index) => {
        if (itemY > 120) return // Space limit
        const itemText = `${index + 1}. ${item.product.name} × ${item.quantity}`
        doc.text(itemText, 5, itemY)
        itemY += 5
    })

    // Total Amount (Highlighted)
    doc.setFillColor(240, 240, 240)
    doc.rect(5, itemY + 5, 90, 10, 'F')
    
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text('TOTAL:', 7, itemY + 11)
    doc.text(`${currency}${order.total.toFixed(2)}`, 93, itemY + 11, { align: 'right' })

    // Payment Status
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    const paymentStatus = order.isPaid ? 'PAID ✓' : 'COD'
    doc.text(`Payment: ${paymentStatus}`, 5, itemY + 18)

    // Footer
    doc.setFontSize(7)
    doc.setTextColor(100, 100, 100)
    doc.text('Thank you for choosing Flour2Door!', 50, 145, { align: 'center' })

    return doc
}

export function printPackingSlip(order, storeInfo) {
    const doc = generatePackingSlip(order, storeInfo)
    doc.autoPrint()
    window.open(doc.output('bloburl'), '_blank')
}