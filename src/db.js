export const db = {
    invoice: {
      create: async ({ data }) => ({ id: Date.now(), ...data }),
      update: async ({ where, data }) => ({ ...where, ...data })
    },
    payment: {
      create: async ({ data }) => data,
      findUnique: async ({ where }) =>
        where.providerPaymentId ? { id: 1, invoiceId: 1, status: 'new' } : null,
      update: async ({ where, data }) => ({ ...where, ...data })
    },
    $transaction: async (queries) => Promise.all(queries)
  };
  