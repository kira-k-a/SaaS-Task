import { db } from '../db.js';

export async function tbankWebhook(req, res) {
  try {
    const { paymentId, status } = req.body;

    const payment = await db.payment.findUnique({
      where: { providerPaymentId: paymentId }
    });

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    if (payment.status === 'confirmed') {
      return res.json({ ok: true });
    }

    if (status === 'success') {
      await db.$transaction([
        db.payment.update({
          where: { id: payment.id },
          data: { status: 'confirmed' }
        }),
        db.invoice.update({
          where: { id: payment.invoiceId },
          data: { status: 'paid' }
        })
      ]);
    } else {
      await db.payment.update({
        where: { id: payment.id },
        data: { status: 'failed' }
      });
    }

    return res.json({ ok: true });
  } catch {
    return res.status(500).json({ error: 'Webhook error' });
  }
}
