import React from 'react';
import { CustomActionSheet, ActionItem } from '@/src/components';
import { documentsStrings } from './strings';
import { Document } from '@/src/services';

interface DocumentActionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  document: Document | null;
  onDownload?: (document: Document) => void;
  onRename?: (document: Document) => void;
  onFileInfo?: (document: Document) => void;
  onDelete?: (document: Document) => void;
}

const DocumentActionSheet: React.FC<DocumentActionSheetProps> = ({
  isOpen,
  onClose,
  document,
  onDownload,
  onRename,
  onFileInfo,
  onDelete,
}) => {
  const handleDownload = () => {
    if (document && onDownload) {
      onDownload(document);
    }
  };

  const handleRename = () => {
    if (document && onRename) {
      onRename(document);
    }
  };

  const handleFileInfo = () => {
    if (document && onFileInfo) {
      onFileInfo(document);
    }
  };

  const handleDelete = () => {
    if (document && onDelete) {
      onDelete(document);
    }
  };

  if (!document) return null;

  const actions: ActionItem[] = [
    {
      id: 'download',
      title: documentsStrings.download,
      onPress: handleDownload,
    },
    {
      id: 'rename',
      title: documentsStrings.rename,
      onPress: handleRename,
    },
    {
      id: 'fileInfo',
      title: documentsStrings.fileInformation,
      onPress: handleFileInfo,
    },
    {
      id: 'delete',
      title: documentsStrings.delete,
      onPress: handleDelete,
      isDestructive: true,
    },
  ];

  return (
    <CustomActionSheet
      isOpen={isOpen}
      onClose={onClose}
      title={document.fileName}
      actions={actions}
    />
  );
};

export default DocumentActionSheet;
