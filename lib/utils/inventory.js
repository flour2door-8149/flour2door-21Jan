import prisma from '@/lib/prisma'

export async function deductInventory(orderItems, storeId) {
  const updates = []
  
  for (const item of orderItems) {
    const product = await prisma.product.findUnique({
      where: { id: item.productId }
    })

    if (product.stock < item.quantity) {
      throw new Error(`Insufficient stock for ${product.name}`)
    }

    // Deduct stock
    updates.push(
      prisma.product.update({
        where: { id: item.productId },
        data: { 
          stock: { decrement: item.quantity },
          updatedAt: new Date()
        }
      })
    )

    // Record in inventory history
    updates.push(
      prisma.inventoryHistory.create({
        data: {
          productId: item.productId,
          storeId,
          quantity: -item.quantity,
          type: 'sale',
          reason: `Order ${orderItems[0].orderId}`
        }
      })
    )
  }

  await prisma.$transaction(updates)
}

export async function restoreInventory(orderItems, storeId) {
  const updates = []
  
  for (const item of orderItems) {
    updates.push(
      prisma.product.update({
        where: { id: item.productId },
        data: { 
          stock: { increment: item.quantity },
          updatedAt: new Date()
        }
      })
    )

    updates.push(
      prisma.inventoryHistory.create({
        data: {
          productId: item.productId,
          storeId,
          quantity: item.quantity,
          type: 'return',
          reason: `Order cancelled/rejected`
        }
      })
    )
  }

  await prisma.$transaction(updates)
}

export async function checkLowStock(storeId) {
  return await prisma.product.findMany({
    where: {
      storeId,
      stock: {
        lte: prisma.raw('low_stock_threshold')
      }
    }
  })
}