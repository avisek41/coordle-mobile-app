import React from 'react';
import { CustomActionSheet, ActionItem } from '@/src/components';
import { documentsStrings } from './strings';
import { Document, TripDocument } from '@/src/services';

interface DocumentActionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  document: (Document | TripDocument) | null;
  onDownload?: (document: Document | TripDocument) => void;
  onRename?: (document: Document | TripDocument) => void;
  onFileInfo?: (document: Document | TripDocument) => void;
  onDelete?: (document: Document | TripDocument) => void;
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
      title={document.originalFileName || document.fileName}
      actions={actions}
    />
  );
};

export default DocumentActionSheet;
