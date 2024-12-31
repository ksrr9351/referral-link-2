'use client';

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { List as ListIcon } from '@phosphor-icons/react/dist/ssr/List';

import { usePopover } from '@/hooks/use-popover';

import { MobileNav } from './mobile-nav';
import { UserPopover } from './user-popover';

export function MainNav(): React.JSX.Element {
  const [openNav, setOpenNav] = React.useState<boolean>(false);
  const [walletAddress, setWalletAddress] = React.useState<string | null>(null);

  const userPopover = usePopover<HTMLDivElement>();

  // Función para conectar wallet
  const connectWallet = async (): Promise<void> => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setWalletAddress(accounts[0]); // Asignamos la primera cuenta conectada
      } catch (error) {
        console.error('Error connecting to wallet:', error);
        alert('Failed to connect wallet. Please try again.');
      }
    } else {
      alert('No Ethereum provider detected. Install MetaMask.');
    }
  };

  // Función para desconectar wallet
  const disconnectWallet = (): void => {
    setWalletAddress(null); // Reinicia el estado de la wallet
  };

  return (
    <React.Fragment>
      <Box
        component="header"
        sx={{
          borderBottom: '1px solid var(--mui-palette-divider)',
          backgroundColor: 'var(--mui-palette-background-paper)',
          position: 'sticky',
          top: 0,
          zIndex: 'var(--mui-zIndex-appBar)',
        }}
      >
        <Stack
          direction="row"
          spacing={2}
          sx={{ alignItems: 'center', justifyContent: 'space-between', minHeight: '64px', px: 2 }}
        >
          <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
            <IconButton
              onClick={(): void => {
                setOpenNav(true);
              }}
              sx={{ display: { lg: 'none' } }}
            >
              <ListIcon />
            </IconButton>
          </Stack>
          <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
            {walletAddress ? (
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography
                  variant="body2"
                  sx={{
                    backgroundColor: 'var(--mui-palette-primary-light)',
                    color: 'var(--mui-palette-primary-contrastText)',
                    borderRadius: 1,
                    px: 1.5,
                    py: 0.5,
                    fontSize: '0.875rem',
                  }}
                >
                  {`${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`}
                </Typography>
                <Button
                  variant="text"
                  color="secondary"
                  onClick={disconnectWallet}
                  size="small"
                  sx={{ textTransform: 'none' }}
                >
                  Disconnect
                </Button>
              </Stack>
            ) : (
              <Button
                variant="outlined"
                color="primary"
                onClick={connectWallet}
                size="small"
                sx={{
                  textTransform: 'none',
                  borderRadius: 2,
                  px: 2,
                }}
              >
                Connect Wallet
              </Button>
            )}
            <Avatar
              onClick={userPopover.handleOpen}
              ref={userPopover.anchorRef}
              src="/assets/avatar.png"
              sx={{ cursor: 'pointer', width: 36, height: 36 }}
            />
          </Stack>
        </Stack>
      </Box>
      <UserPopover anchorEl={userPopover.anchorRef.current} onClose={userPopover.handleClose} open={userPopover.open} />
      <MobileNav
        onClose={() => {
          setOpenNav(false);
        }}
        open={openNav}
      />
    </React.Fragment>
  );
}
