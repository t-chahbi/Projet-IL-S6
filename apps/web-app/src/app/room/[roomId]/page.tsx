'use client';
import React from 'react';
import Lecteur from '@/components/ui/room/Lecteur';

export default function page() {
  return (
    <div className="flex justify-center items-center h-screen">
      <Lecteur videoUrl="https://youtu.be/qIPdQmzuX9I?si=aeef7szeLDqV2UGy" />
    </div>
  );
}
