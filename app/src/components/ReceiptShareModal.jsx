import { useMemo } from 'react';
import { drawReceiptCard } from '../lib/receiptCanvas';
import { formatRupiah } from '../lib/zakat';
import { useTheme } from '../context/ThemeContext';
import ShareModalShell from './ShareModalShell';

const dateFmt = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

export default function ReceiptShareModal({ contribution, onClose }) {
  const { theme } = useTheme();
  const drawArgs = useMemo(
    () => ({
      amountLabel: formatRupiah(contribution.amount),
      donationTitle: contribution.donationTitle,
      dateLabel: contribution.createdAt ? dateFmt.format(contribution.createdAt.toDate()) : dateFmt.format(new Date()),
      theme,
    }),
    [contribution, theme]
  );
  return (
    <ShareModalShell
      draw={drawReceiptCard}
      drawArgs={drawArgs}
      filename="bukti-sedekah.png"
      shareTitle="Bukti Sedekah - airmoon"
      onClose={onClose}
    />
  );
}
