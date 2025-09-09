
import { useMemo, Suspense } from 'react';
import { AppRoutes } from "../../lib/common/AppRoutes";
import { loadPublications } from "../../lib/publications";
import ItemList, { type Item } from "../../lib/common/ui/ItemList";
import { LoadingSpinnerFallback } from '../../lib/common/ui/spinner/LoadingSpinnerFallback';

function PublicationsInner() {
  const pubs = useMemo(() => loadPublications(), []);
  return (
    <ItemList
      title={AppRoutes.PUBLICATIONS.title}
      items={pubs as unknown as Item[]}
      countLabel="publications"
      listAriaLabel="Publications list"
      paginationAriaLabel="Publications pagination"
      getItemHref={(p) => `${AppRoutes.PUBLICATIONS.path}/${p.pid}`}
    />
  );
}

export default function Publications() {
  return (
    <Suspense fallback={<LoadingSpinnerFallback />}> 
      <PublicationsInner />
    </Suspense>
  );
}

