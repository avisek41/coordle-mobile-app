import React, { useState } from 'react';
import { CustomActionSheet, ActionItem } from './CustomActionSheet';
import { GradientButton } from './GradientButton';
import { VStack } from '@/components/ui/vstack';

// Example usage of CustomActionSheet
const CustomActionSheetExample: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenActionSheet = () => {
    setIsOpen(true);
  };

  const handleCloseActionSheet = () => {
    setIsOpen(false);
  };

  const handleEdit = () => {
    console.log('Edit pressed');
  };

  const handleShare = () => {
    console.log('Share pressed');
  };

  const handleDelete = () => {
    console.log('Delete pressed');
  };

  const handleCancel = () => {
    console.log('Cancel pressed');
  };

  // Define actions array
  const actions: ActionItem[] = [
    {
      id: 'edit',
      title: 'Edit',
      onPress: handleEdit,
    },
    {
      id: 'share',
      title: 'Share',
      onPress: handleShare,
    },
    {
      id: 'delete',
      title: 'Delete',
      onPress: handleDelete,
      isDestructive: true,
    },
  ];

  return (
    <VStack className="p-4">
      <GradientButton
        title="Open Action Sheet"
        onPress={handleOpenActionSheet}
      />

      <CustomActionSheet
        isOpen={isOpen}
        onClose={handleCloseActionSheet}
        title="Choose an action"
        subtitle="Select what you want to do with this item"
        actions={actions}
        showCancelButton={true}
        cancelButtonText="Cancel"
        onCancelPress={handleCancel}
      />
    </VStack>
  );
};

export default CustomActionSheetExample;
