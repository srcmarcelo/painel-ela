'use client';

import React, { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { AlertCircleIcon } from 'lucide-react';
import { useData } from '@/lib/data/context';
import { newInstagramAccount } from '@/modules/panel/announcements';

export function AnnouncementModal() {
  const { responsibles } = useData();
  const [status, setStatus] = useState<string>();

  const handleSubmit = async () => {
    setStatus('loading');
    const response = await newInstagramAccount(
      responsibles.map((responsible) => responsible.phone)
    );
    if (response.includes(200)) {
      setStatus('success');
    } else {
      setStatus('error');
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <AlertCircleIcon />
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Comunicado geral</DialogTitle>
          <DialogDescription>
            Esse comunicado será enviado a TODOS os responsáveis, gastando por
            volta de 40 reais de créditos.
          </DialogDescription>
        </DialogHeader>
        {status === 'success' && <div>Deu certo!</div>}
        {status === 'error' && <div>Deu erro</div>}
        {status === 'loading' && <div>Enviando... Não saia!</div>}
        <div className='grid gap-4 py-4'>
          No momento só existe um tipo de aviso (Instagram)
        </div>
        <DialogFooter>
          {responsibles.length > 0 && (
            <Button onClick={() => handleSubmit()}>Enviar</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
