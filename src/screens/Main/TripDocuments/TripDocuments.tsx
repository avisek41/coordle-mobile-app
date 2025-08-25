import React from 'react';
import { useRoute } from '@react-navigation/native';
import { MainRouteProps } from '@/src/types/allRoutes';
import DocumentsView from '@/src/components/DocumentsView';

const TripDocuments: React.FC = () => {
  const route = useRoute<MainRouteProps<'TripDocuments'>>();
  const { tripId, tripTitle } = route.params;

  return (
    <DocumentsView
      title={tripTitle || 'Trip Documents'}
      tripId={tripId}
      isTripDocuments={true}
    />
  );
};

export default TripDocuments;
