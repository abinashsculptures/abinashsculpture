
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface CartoonAvatarProps {
  name: string;
  backgroundColor?: string;
}

const CartoonAvatar: React.FC<CartoonAvatarProps> = ({ 
  name, 
  backgroundColor = "random" 
}) => {
  const initials = name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase();
    
  const bgColors = [
    "b6e3f4", // light blue
    "ffdfbf", // light orange
    "ffd5dc", // light pink
    "d1d4f9", // light purple
    "c0aede", // lavender
    "fdcece"  // light red
  ];
  
  const bgColor = backgroundColor === "random" 
    ? bgColors[Math.floor(Math.random() * bgColors.length)] 
    : backgroundColor;
    
  return (
    <Avatar className="h-16 w-16">
      <AvatarImage 
        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}&backgroundColor=${bgColor}`} 
        alt={name} 
      />
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  );
};

export default CartoonAvatar;
