'use client'

import { useState } from 'react'

interface Category {
  _id: string
  name: string
  icon: string
  parentId: string | null
  subCategoryCount: number
}

interface CategoryListProps {
  categories: Category[]
  isLoading: boolean
  onDelete: (id: string) => Promise<void>
  onViewSubcategories: (id: string) => void
  onBack?: () => void
}

export default function CategoryList({
  categories,
  isLoading,
  onDelete,
  onViewSubcategories,
  onBack,
}: CategoryListProps) {
  const [searchTerm, setSearchTerm] = useState('')

  const filtered = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="card rounded-2xl overflow-hidden">
      <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <span className="material-icons-outlined text-primary">list_alt</span>
          All Categories
          {onBack && (
            <button
              onClick={onBack}
              className="ml-4 text-sm text-primary hover:underline flex items-center gap-1"
            >
              <span className="material-icons-outlined text-sm">arrow_back</span>
              Back
            </button>
          )}
        </h2>

        <div className="relative">
          <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
            search
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search categories..."
            className="pl-9 pr-4 py-1.5 text-sm rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 outline-none focus:border-primary transition-colors"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="p-12 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center text-slate-500">No categories found</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50">
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Icon
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Category Name
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center">
                  Sub-categories
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((category) => (
                <tr
                  key={category._id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      {category.icon.startsWith('data:') ? (
                        <img
                          src={category.icon}
                          alt="icon"
                          className="w-6 h-6 object-contain"
                        />
                      ) : (
                        <span className="material-icons-outlined text-primary">{category.icon}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900 dark:text-white">{category.name}</div>
                    <div className="text-xs text-slate-500">
                      {category.parentId ? 'Sub-category' : 'Root Category'}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {category.subCategoryCount > 0 && (
                      <button
                        onClick={() => onViewSubcategories(category._id)}
                        className="inline-flex items-center px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary transition-colors group"
                      >
                        {category.subCategoryCount} Sub-cats
                        <span className="material-icons-outlined text-xs ml-1 group-hover:translate-x-0.5 transition-transform">
                          chevron_right
                        </span>
                      </button>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onDelete(category._id)}
                        className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                        title="Delete"
                      >
                        <span className="material-icons-outlined text-sm">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}