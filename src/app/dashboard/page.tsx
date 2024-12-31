import * as React from 'react';
import type { Metadata } from 'next';
import Grid from '@mui/material/Unstable_Grid2';
import dayjs from 'dayjs';

import { config } from '@/config';
import { Budget } from '@/components/dashboard/overview/budget';
import { LatestOrders } from '@/components/dashboard/overview/latest-orders';
import { Sales } from '@/components/dashboard/overview/sales';
import { TotalCustomers } from '@/components/dashboard/overview/total-customers';
import { TotalProfit } from '@/components/dashboard/overview/total-profit';
import { Currentrwa } from '@/components/dashboard/overview/current-rwa';


export const metadata = { title: `Overview | Dashboard | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  return (
    <Grid container spacing={3}>
      <Grid lg={3} sm={6} xs={12}>
        <Budget diff={10} trend="up" sx={{ height: '100%' }} value="20 $RWA" />
      </Grid>
      <Grid lg={3} sm={6} xs={12}>
        <TotalCustomers diff={4} trend="down" sx={{ height: '100%' }} value="4" />
      </Grid>
      <Grid lg={3} sm={6} xs={12}>
        <Currentrwa sx={{ height: '100%' }} value="0 $RWA" />
      </Grid>
      <Grid lg={3} sm={6} xs={12}>
        <TotalProfit sx={{ height: '100%' }} value="122 $RWA" />
      </Grid>
      <Grid lg={12} xs={12}>
        <Sales
          chartSeries={[
            { name: 'This year', data: [0, 0, 0, 0, 0, 0, 50, 1, 10, 5, 10, 20] },
            { name: 'Last year', data: [12, 33, 0, 0, 12, 14, 0, 0, 0, 5, 0, 0] },
          ]}
          sx={{ height: '100%' }}
        />
      </Grid>
      <Grid lg={12} md={12} xs={12}>
        <LatestOrders
          orders={[
            {
              id: '007',
              customer: { name: 'Kevin Yunai' },
              amount: 0,
              createdAt: dayjs().subtract(10, 'minutes').toDate(),
            },
            {
              id: '006',
              customer: { name: 'Manuel Acevedo' },
              amount: 0,
              createdAt: dayjs().subtract(10, 'minutes').toDate(),
            },
            {
              id: '004',
              customer: { name: 'Mike Storm' },
              amount: 0,
              createdAt: dayjs().subtract(10, 'minutes').toDate(),
            },
            {
              id: '001',
              customer: { name: 'AJ Dinger' },
              amount: 0,
              createdAt: dayjs().subtract(10, 'minutes').toDate(),
            },
          ]}
          sx={{ height: '100%' }}
        />
      </Grid>
    </Grid>
  );
}
