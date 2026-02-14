import * as React from 'react';

import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QuickEditModal, { QuickEditValues } from './QuickEditModal';
import { productService } from '../../../services/productService';
import { parseApiError } from '../../../utils/apiError';
import { useToast } from '../../Toast';
import { logout } from '../../../services/authService';

type AdminListItem = {
  id: number;
  name: string;
  sku?: string | null;
  slug?: string | null;
  thumbnail?: string | null;
  status?: string | null;
  category?: string | null;
  price_min?: number | null;
  price_max?: number | null;
  stock_total?: number | null;
  variant_count?: number | null;
  profit_min?: number | null;
  margin_percent?: number | null;
};

type Props = {
  items: AdminListItem[];
  loading: boolean;
  selectedIds: number[];
  onToggleSelect: (id: number, checked: boolean) => void;
  onToggleSelectAll: (checked: boolean) => void;
  sort: string;
  onSortChange: (next: string) => void;
  columnVisibility: { profit: boolean; category: boolean };
  onRefresh: () => void;
};

const formatCurrency = (value: unknown) => {
  const num = Number(value);
  if (!Number.isFinite(num)) return '-';
  return num.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
};

const formatRange = (min?: number | null, max?: number | null) => {
  const a = Number(min);
  const b = Number(max);
  if (!Number.isFinite(a) && !Number.isFinite(b)) return '-';
  if (Number.isFinite(a) && !Number.isFinite(b)) return formatCurrency(a);
  if (!Number.isFinite(a) && Number.isFinite(b)) return formatCurrency(b);
  if (a === b) return formatCurrency(a);
  return `${formatCurrency(a)} – ${formatCurrency(b)}`;
};

const StatusPill = ({ value }: { value?: string | null }) => {
  const v = String(value || '').toLowerCase();
  const map: Record<string, { label: string; cls: string }> = {
    active: { label: 'Đang bán', cls: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' },
    draft: { label: 'Nháp', cls: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200' },
    discontinued: { label: 'Ngừng bán', cls: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300' },
    inactive: { label: 'Ngừng bán', cls: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300' },
  };
  const def = map[v] || { label: value || '-', cls: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300' };
  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${def.cls}`}>{def.label}</span>;
};

const StockCell = ({ total }: { total?: number | null }) => {
  const t = Number(total ?? 0);
  const cls = t <= 0 ? 'text-red-600' : t <= 5 ? 'text-amber-600' : 'text-emerald-700 dark:text-emerald-300';
  const label = t <= 0 ? 'Hết hàng' : t <= 5 ? `Sắp hết (${t})` : `${t}`;
  return <div className={`text-sm font-semibold ${cls}`}>{label}</div>;
};

const sortOptions: Array<{ value: string; label: string }> = [
  { value: 'created_desc', label: 'Mới nhất' },
  { value: 'created_asc', label: 'Cũ nhất' },
  { value: 'name_asc', label: 'Tên A→Z' },
  { value: 'name_desc', label: 'Tên Z→A' },
  { value: 'price_desc', label: 'Giá cao → thấp' },
  { value: 'price_asc', label: 'Giá thấp → cao' },
  { value: 'stock_desc', label: 'Tồn kho cao → thấp' },
  { value: 'stock_asc', label: 'Tồn kho thấp → cao' },
  { value: 'updated_desc', label: 'Cập nhật gần đây' },
];

const ProductsTable = ({
  items,
  loading,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  sort,
  onSortChange,
  columnVisibility,
  onRefresh,
}: Props) => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [expanded, setExpanded] = useState<Record<number, boolean>>({});
  const [variantsByProduct, setVariantsByProduct] = useState<Record<number, any[]>>({});
  const [variantsLoading, setVariantsLoading] = useState<Record<number, boolean>>({});
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [statusBusy, setStatusBusy] = useState<Record<number, boolean>>({});
  const [quickEdit, setQuickEdit] = useState<{ open: boolean; item: AdminListItem | null; saving: boolean }>({
    open: false,
    item: null,
    saving: false,
  });

  const allSelected = useMemo(() => {
    if (!items?.length) return false;
    return items.every((p) => selectedIds.includes(p.id));
  }, [items, selectedIds]);

  const handleAuthOrToast = (error: any, fallbackMessage: string) => {
    const parsed = parseApiError(error);
    if (parsed?.status === 401) {
      showToast('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.', 'error', 5000);
      logout();
      const current = `${window.location.pathname}${window.location.search}`;
      window.location.href = `/admin/login?redirect=${encodeURIComponent(current)}`;
      return true;
    }
    showToast(parsed?.message || fallbackMessage, 'error', 7000);
    return false;
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xoá sản phẩm này?')) return;
    setDeletingId(id);
    try {
      await productService.deleteProduct(id);
      showToast('Đã xoá sản phẩm', 'success');
      onRefresh();
    } catch (error) {
      handleAuthOrToast(error, 'Không xoá được sản phẩm');
    } finally {
      setDeletingId(null);
    }
  };

  const toggleExpand = async (id: number, variantCount: number) => {
    if (variantCount <= 0) return;
    setExpanded((p) => ({ ...p, [id]: !p[id] }));
    const nextExpanded = !expanded[id];
    if (!nextExpanded) return;
    if (variantsByProduct[id]) return;

    setVariantsLoading((p) => ({ ...p, [id]: true }));
    try {
      const variants = await productService.getProductVariants(id);
      setVariantsByProduct((p) => ({ ...p, [id]: Array.isArray(variants) ? variants : [] }));
    } catch (error) {
      handleAuthOrToast(error, 'Không tải được biến thể');
    } finally {
      setVariantsLoading((p) => ({ ...p, [id]: false }));
    }
  };

  const updateStatusInline = async (id: number, nextStatus: string) => {
    setStatusBusy((p) => ({ ...p, [id]: true }));
    try {
      await productService.updateProductPartial(id, { status: nextStatus });
      showToast('Đã cập nhật trạng thái', 'success');
      onRefresh();
    } catch (error) {
      const parsed = parseApiError(error);
      if (parsed?.status === 404) {
        showToast('Backend chưa hỗ trợ cập nhật nhanh', 'error', 7000);
      } else {
        handleAuthOrToast(error, 'Không cập nhật được trạng thái');
      }
    } finally {
      setStatusBusy((p) => ({ ...p, [id]: false }));
    }
  };

  const updateVariantInline = async (variantId: number, patch: any) => {
    try {
      await productService.updateVariantPartial(variantId, patch);
      showToast('Đã cập nhật biến thể', 'success');
    } catch (error) {
      const parsed = parseApiError(error);
      if (parsed?.status === 404) {
        showToast('Backend chưa hỗ trợ cập nhật biến thể', 'error', 7000);
      } else {
        handleAuthOrToast(error, 'Không cập nhật được biến thể');
      }
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-10 bg-gray-100 dark:bg-gray-800 rounded-xl mb-3" />
        <div className="h-10 bg-gray-100 dark:bg-gray-800 rounded-xl mb-3" />
        <div className="h-10 bg-gray-100 dark:bg-gray-800 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800">
      <div className="px-4 py-3 bg-gray-50 dark:bg-gray-950 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div className="flex items-center gap-3">
          <input type="checkbox" checked={allSelected} onChange={(e) => onToggleSelectAll(e.target.checked)} />
          <div className="text-sm text-gray-600 dark:text-gray-300">Chọn tất cả</div>
          {selectedIds.length > 0 && (
            <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">({selectedIds.length} đã chọn)</div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="text-sm text-gray-600 dark:text-gray-300">Sắp xếp</div>
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value)}
            className="rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500"
          >
            {sortOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800 bg-white dark:bg-gray-900">
          <thead className="bg-white dark:bg-gray-900">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500"> </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Sản phẩm</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Giá</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Tồn kho</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Biến thể</th>
              {columnVisibility.profit && (
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Lợi nhuận</th>
              )}
              {columnVisibility.category && (
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Danh mục</th>
              )}
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Trạng thái</th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {items.map((p) => {
              const vCount = Number(p.variant_count ?? 0);
              const isExpanded = Boolean(expanded[p.id]);
              const variants = variantsByProduct[p.id];

              return (
                <React.Fragment key={p.id}>
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-950/40">
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(p.id)}
                          onChange={(e) => onToggleSelect(p.id, e.target.checked)}
                        />
                        <button
                          type="button"
                          onClick={() => toggleExpand(p.id, vCount)}
                          disabled={vCount <= 0}
                          className="text-gray-600 dark:text-gray-300 disabled:opacity-30"
                          title={vCount > 0 ? 'Xem biến thể' : 'Không có biến thể'}
                        >
                          {isExpanded ? '▾' : '▸'}
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
                          {p.thumbnail ? (
                            <img src={p.thumbnail} alt={p.name} className="h-full w-full object-cover" />
                          ) : (
                            <div className="h-full w-full" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-gray-900 dark:text-gray-100 truncate">{p.name}</div>
                          <div className="text-xs text-gray-500 truncate">SKU: {p.sku || '-'} • Slug: {p.slug || '-'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">
                      {formatRange(p.price_min ?? null, p.price_max ?? null)}
                    </td>
                    <td className="px-4 py-3">
                      <StockCell total={p.stock_total} />
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">{vCount}</td>
                    {columnVisibility.profit && (
                      <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">
                        <div className="font-semibold">{formatCurrency(p.profit_min)}</div>
                        {Number.isFinite(Number(p.margin_percent)) && (
                          <div className="text-xs text-gray-500">Margin: {Number(p.margin_percent).toFixed(1)}%</div>
                        )}
                      </td>
                    )}
                    {columnVisibility.category && (
                      <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">{p.category || '-'}</td>
                    )}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <StatusPill value={p.status} />
                        <select
                          value={String(p.status || 'active').toLowerCase()}
                          disabled={Boolean(statusBusy[p.id])}
                          onChange={(e) => updateStatusInline(p.id, e.target.value)}
                          className="rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 px-2 py-1 text-xs text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500"
                        >
                          <option value="active">Đang bán</option>
                          <option value="draft">Nháp</option>
                          <option value="discontinued">Ngừng bán</option>
                        </select>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setQuickEdit({ open: true, item: p, saving: false })}
                          className="rounded-xl border border-gray-300 dark:border-gray-700 px-3 py-1.5 text-sm font-semibold"
                        >
                          Quick edit
                        </button>
                        <button
                          type="button"
                          onClick={() => navigate(`/admin/product/update/${p.id}`)}
                          className="rounded-xl border border-gray-300 dark:border-gray-700 px-3 py-1.5 text-sm font-semibold"
                        >
                          Sửa
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(p.id)}
                          disabled={deletingId === p.id}
                          className="rounded-xl bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 text-sm font-semibold disabled:opacity-60"
                        >
                          {deletingId === p.id ? 'Đang xoá...' : 'Xoá'}
                        </button>
                      </div>
                    </td>
                  </tr>

                  {isExpanded && (
                    <tr className="bg-gray-50 dark:bg-gray-950">
                      <td colSpan={9} className="px-4 py-4">
                        {variantsLoading[p.id] && <div className="text-sm text-gray-500">Đang tải biến thể...</div>}
                        {!variantsLoading[p.id] && Array.isArray(variants) && variants.length === 0 && (
                          <div className="text-sm text-gray-500">Không có biến thể</div>
                        )}
                        {!variantsLoading[p.id] && Array.isArray(variants) && variants.length > 0 && (
                          <div className="overflow-x-auto">
                            <table className="min-w-full">
                              <thead>
                                <tr className="text-left text-xs uppercase tracking-wider text-gray-500">
                                  <th className="py-2 pr-4">SKU</th>
                                  <th className="py-2 pr-4">Tên</th>
                                  <th className="py-2 pr-4">Giá</th>
                                  <th className="py-2 pr-4">Cost</th>
                                  <th className="py-2 pr-4">Tồn</th>
                                  <th className="py-2 pr-4">Hành động</th>
                                </tr>
                              </thead>
                              <tbody className="text-sm">
                                {variants.map((v: any) => (
                                  <VariantRow key={v.id || `${p.id}-${v.sku}`} variant={v} onSave={updateVariantInline} />
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="md:hidden divide-y divide-gray-200 dark:divide-gray-800 bg-white dark:bg-gray-900">
        {items.map((p) => {
          const vCount = Number(p.variant_count ?? 0);
          return (
            <div key={p.id} className="p-4">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(p.id)}
                  onChange={(e) => onToggleSelect(p.id, e.target.checked)}
                  className="mt-1"
                />
                <div className="h-16 w-16 overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
                  {p.thumbnail ? <img src={p.thumbnail} alt={p.name} className="h-full w-full object-cover" /> : <div className="h-full w-full" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-900 dark:text-gray-100 truncate">{p.name}</div>
                  <div className="text-xs text-gray-500 truncate">SKU: {p.sku || '-'} • Slug: {p.slug || '-'}</div>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="text-sm font-semibold text-gray-800 dark:text-gray-200">{formatRange(p.price_min, p.price_max)}</div>
                    <StatusPill value={p.status} />
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <StockCell total={p.stock_total} />
                    <div className="text-sm text-gray-700 dark:text-gray-200">Biến thể: {vCount}</div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setQuickEdit({ open: true, item: p, saving: false })}
                      className="rounded-xl border border-gray-300 dark:border-gray-700 px-3 py-1.5 text-sm font-semibold"
                    >
                      Quick edit
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate(`/admin/product/update/${p.id}`)}
                      className="rounded-xl border border-gray-300 dark:border-gray-700 px-3 py-1.5 text-sm font-semibold"
                    >
                      Sửa
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(p.id)}
                      disabled={deletingId === p.id}
                      className="rounded-xl bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 text-sm font-semibold disabled:opacity-60"
                    >
                      {deletingId === p.id ? 'Đang xoá...' : 'Xoá'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <QuickEditModal
        open={quickEdit.open}
        productName={quickEdit.item?.name || ''}
        saving={quickEdit.saving}
        initial={{
          price:
            quickEdit.item?.price_min !== undefined && quickEdit.item?.price_min !== null
              ? String(quickEdit.item.price_min)
              : undefined,
          stock:
            quickEdit.item?.stock_total !== undefined && quickEdit.item?.stock_total !== null
              ? String(quickEdit.item.stock_total)
              : undefined,
          status: (String(quickEdit.item?.status || 'draft').toLowerCase() as any) || 'draft',
        }}
        onClose={() => setQuickEdit({ open: false, item: null, saving: false })}
        onSave={async (next: QuickEditValues) => {
          if (!quickEdit.item) return;
          setQuickEdit((p) => ({ ...p, saving: true }));
          try {
            await productService.updateProductPartial(quickEdit.item.id, {
              ...(next.price !== undefined ? { price: Number(next.price) } : {}),
              ...(next.stock !== undefined ? { stock: Number(next.stock) } : {}),
              ...(next.status !== undefined ? { status: next.status } : {}),
              ...(next.cost_price !== undefined ? { cost_price: Number(next.cost_price) } : {}),
            });
            showToast('Đã lưu quick edit', 'success');
            setQuickEdit({ open: false, item: null, saving: false });
            onRefresh();
          } catch (error) {
            handleAuthOrToast(error, 'Không lưu được quick edit');
            setQuickEdit((p) => ({ ...p, saving: false }));
          }
        }}
      />
    </div>
  );
};

const VariantRow = ({
  variant,
  onSave,
}: {
  variant: any;
  onSave: (variantId: number, patch: any) => Promise<void>;
}) => {
  const [price, setPrice] = useState(String(variant?.price ?? ''));
  const [cost, setCost] = useState(String(variant?.cost_price ?? variant?.cost ?? ''));
  const [stock, setStock] = useState(String(variant?.stock ?? variant?.quantity ?? ''));
  const [busy, setBusy] = useState(false);

  const doSave = async () => {
    if (!variant?.id) return;
    setBusy(true);
    try {
      await onSave(Number(variant.id), {
        ...(price !== '' ? { price: Number(price) } : {}),
        ...(cost !== '' ? { cost_price: Number(cost) } : {}),
        ...(stock !== '' ? { stock: Number(stock) } : {}),
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <tr className="border-t border-gray-200/70 dark:border-gray-800">
      <td className="py-2 pr-4">{variant?.sku || '-'}</td>
      <td className="py-2 pr-4">{variant?.name || variant?.title || '-'}</td>
      <td className="py-2 pr-4">
        <input
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          inputMode="numeric"
          className="w-28 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-2 py-1 text-sm"
        />
      </td>
      <td className="py-2 pr-4">
        <input
          value={cost}
          onChange={(e) => setCost(e.target.value)}
          inputMode="numeric"
          className="w-28 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-2 py-1 text-sm"
        />
      </td>
      <td className="py-2 pr-4">
        <input
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          inputMode="numeric"
          className="w-24 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-2 py-1 text-sm"
        />
      </td>
      <td className="py-2 pr-4">
        <button
          type="button"
          onClick={doSave}
          disabled={busy}
          className="rounded-xl border border-gray-300 dark:border-gray-700 px-3 py-1 text-sm font-semibold disabled:opacity-60"
        >
          {busy ? 'Đang lưu...' : 'Lưu'}
        </button>
      </td>
    </tr>
  );
};

export default ProductsTable;
