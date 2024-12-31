import * as React from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, Chip } from '@mui/material';
import dayjs from 'dayjs';

interface Referral {
  id: string;
  name: string;
  date: Date;
  rewards: number;
}

interface ReferralTableProps {
  referrals: Referral[];
}

export function ReferralTable({ referrals }: ReferralTableProps): React.JSX.Element {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Name</TableCell>
          <TableCell>Referral Date</TableCell>
          <TableCell>Rewards Earned</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {referrals.map((referral) => (
          <TableRow key={referral.id}>
            <TableCell>{referral.name}</TableCell>
            <TableCell>{dayjs(referral.date).format('MMM D, YYYY')}</TableCell>
            <TableCell>${referral.rewards.toFixed(2)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
