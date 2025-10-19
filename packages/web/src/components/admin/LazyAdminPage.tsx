import { lazy, Suspense } from "react";
import { LoadingState } from "./LoadingState";

// Lazy load admin pages
export const LazyProductListPage = lazy(() =>
  import("../../pages/admin/ProductListPage").then((module) => ({
    default: module.ProductListPage,
  }))
);

export const LazyProductFormPage = lazy(() =>
  import("../../pages/admin/ProductFormPage").then((module) => ({
    default: module.ProductFormPage,
  }))
);

export const LazyOrderListPage = lazy(() =>
  import("../../pages/admin/OrderListPage").then((module) => ({
    default: module.OrderListPage,
  }))
);

export const LazyOrderDetailPage = lazy(() =>
  import("../../pages/admin/OrderDetailPage").then((module) => ({
    default: module.OrderDetailPage,
  }))
);

export const LazyBlogListPage = lazy(() =>
  import("../../pages/admin/BlogListPage").then((module) => ({
    default: module.BlogListPage,
  }))
);

export const LazyBlogFormPage = lazy(() =>
  import("../../pages/admin/BlogFormPage").then((module) => ({
    default: module.BlogFormPage,
  }))
);

export const LazyBlogPreviewPage = lazy(() =>
  import("../../pages/admin/BlogPreviewPage").then((module) => ({
    default: module.BlogPreviewPage,
  }))
);

export const LazyFAQListPage = lazy(() =>
  import("../../pages/admin/FAQListPage").then((module) => ({
    default: module.FAQListPage,
  }))
);

export const LazyFAQFormPage = lazy(() =>
  import("../../pages/admin/FAQFormPage").then((module) => ({
    default: module.FAQFormPage,
  }))
);

export const LazyPromotionListPage = lazy(() =>
  import("../../pages/admin/PromotionListPage").then((module) => ({
    default: module.PromotionListPage,
  }))
);

export const LazyPromotionFormPage = lazy(() =>
  import("../../pages/admin/PromotionFormPage").then((module) => ({
    default: module.PromotionFormPage,
  }))
);

export const LazyContactListPage = lazy(() =>
  import("../../pages/admin/ContactListPage").then((module) => ({
    default: module.ContactListPage,
  }))
);

export const LazyContactDetailPage = lazy(() =>
  import("../../pages/admin/ContactDetailPage").then((module) => ({
    default: module.ContactDetailPage,
  }))
);

export const LazyAboutEditPage = lazy(() =>
  import("../../pages/admin/AboutEditPage").then((module) => ({
    default: module.AboutEditPage,
  }))
);

// Wrapper component for lazy loading with suspense
interface LazyPageWrapperProps {
  children: React.ReactNode;
}

export function LazyPageWrapper({ children }: LazyPageWrapperProps) {
  return (
    <Suspense fallback={<LoadingState showSpinner message="Loading page..." />}>
      {children}
    </Suspense>
  );
}
