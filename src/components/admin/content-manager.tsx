"use client"

import { useState, useEffect, FormEvent } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/supabase/client";
import type { PortfolioSection, PortfolioItem } from "@/types";

// Helper classes
const inputClass = "block w-full border-2 border-black rounded-none p-2 mb-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white font-space"; // Added font-space
const textareaClass = inputClass + " resize-none";
const selectClass = inputClass + " bg-white"; // font-space already in inputClass
const buttonPrimaryClass = "bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-3 rounded-none font-bold border-2 border-black shadow-[3px_3px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1.5px_1.5px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-150 font-space"; // Added font-space
const buttonSecondaryClass = "bg-gray-200 hover:bg-gray-300 text-black py-2 px-3 rounded-none font-bold border-2 border-black shadow-[3px_3px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1.5px_1.5px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-150 font-space"; // Added font-space
const buttonActionSmallClass = (actionColor: string, hoverActionColor: string, textColor: string = "text-black") =>
    `text-xs ${actionColor} hover:${hoverActionColor} ${textColor} px-2 py-1 rounded-none font-semibold border border-black shadow-[1px_1px_0px_#000] active:translate-x-[0.5px] active:translate-y-[0.5px] active:shadow-none transition-all font-space`; // Added font-space


export default function ContentManager() {
  const [sections, setSections] = useState<PortfolioSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingSection, setEditingSection] = useState<PortfolioSection | null>(null);
  const [isCreatingSection, setIsCreatingSection] = useState(false);

  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [isCreatingItemInSection, setIsCreatingItemInSection] = useState<string | null>(null);

  const fetchPortfolioContent = async () => {
    setIsLoading(true); setError(null);
    const { data: sectionsData, error: sectionsError } = await supabase
      .from('portfolio_sections')
      .select(`*, portfolio_items (*)`)
      .order('display_order', { ascending: true })
      .order('display_order', { foreignTable: 'portfolio_items', ascending: true });

    if (sectionsError) {
      setError("Failed to load portfolio content: " + sectionsError.message);
      setSections([]);
    } else {
      setSections(sectionsData || []);
    }
    setIsLoading(false);
  };

  useEffect(() => { fetchPortfolioContent(); }, []);

  const handleSaveSection = async (sectionData: Partial<PortfolioSection>) => {
    setIsLoading(true); setError(null);
    const { user_id, portfolio_items, ...saveData } = sectionData;

    let response;
    if (editingSection?.id) {
      response = await supabase.from('portfolio_sections').update(saveData).eq('id', editingSection.id).select();
    } else {
      response = await supabase.from('portfolio_sections').insert(saveData).select();
    }

    if (response.error) setError("Failed to save section: " + response.error.message);
    else { setEditingSection(null); setIsCreatingSection(false); await fetchPortfolioContent(); }
    setIsLoading(false);
  };

  const handleDeleteSection = async (sectionId: string) => {
    if (!confirm("Delete this section and ALL its items? This is irreversible.")) return;
    setIsLoading(true);
    const { error: deleteError } = await supabase.from('portfolio_sections').delete().eq('id', sectionId);
    if (deleteError) setError("Failed to delete section: " + deleteError.message);
    else await fetchPortfolioContent();
    setIsLoading(false);
  };

  const handleSaveItem = async (itemData: Partial<PortfolioItem>, sectionId: string) => {
    setIsLoading(true); setError(null);
    const { user_id, ...saveData } = itemData;

    let response;
    if (editingItem?.id) {
        response = await supabase.from('portfolio_items').update({ ...saveData, section_id: sectionId }).eq('id', editingItem.id).select();
    } else {
        response = await supabase.from('portfolio_items').insert({ ...saveData, section_id: sectionId }).select();
    }

    if (response.error) setError("Failed to save item: " + response.error.message);
    else { setEditingItem(null); setIsCreatingItemInSection(null); await fetchPortfolioContent(); }
    setIsLoading(false);
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!confirm("Delete this item? This is irreversible.")) return;
    setIsLoading(true);
    const { error: deleteError } = await supabase.from('portfolio_items').delete().eq('id', itemId);
    if (deleteError) setError("Failed to delete item: " + deleteError.message);
    else await fetchPortfolioContent();
    setIsLoading(false);
  };


  if (isLoading && sections.length === 0) return <p className="font-bold p-4 font-space">Loading content manager...</p>; // Added font-space
  if (error) return <p className="text-red-700 bg-red-100 border-2 border-red-500 p-4 font-semibold rounded-none font-space">{error}</p>; // Added font-space

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mx-auto font-space"> {/* Added font-space */}
      <div className="bg-white border-2 border-black rounded-none">
        <div className="px-6 py-4 border-b-2 border-black flex justify-between items-center bg-gray-100">
          <h2 className="text-xl font-bold text-black">Portfolio Content</h2>
          <button
            onClick={() => { setIsCreatingSection(true); setEditingSection(null); }}
            className={buttonPrimaryClass}
          >
            + Add Section
          </button>
        </div>

        {(isCreatingSection || editingSection) && (
          <div className="p-6 border-b-2 border-black bg-yellow-50">
            <h3 className="text-lg font-bold text-black mb-3">
              {editingSection ? `Edit Section: ${editingSection.title}` : "Create New Section"}
            </h3>
            <form onSubmit={(e: FormEvent<HTMLFormElement>) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const data: Partial<PortfolioSection> = {
                    title: formData.get('title') as string,
                    type: formData.get('type') as PortfolioSection['type'],
                    content: formData.get('content') as string || null,
                    display_order: parseInt(formData.get('display_order') as string) || 0,
                };
                handleSaveSection(data);
            }}>
                <input name="title" placeholder="Section Title" defaultValue={editingSection?.title} required className={inputClass}/>
                <select name="type" defaultValue={editingSection?.type || 'markdown'} required  className={selectClass}>
                    <option value="markdown">Markdown</option>
                    <option value="list_items">List of Items</option>
                </select>
                <textarea name="content" placeholder="Content (for Markdown type)" defaultValue={editingSection?.content || ''} className={textareaClass}/>
                <input type="number" name="display_order" placeholder="Order (e.g., 1, 2, 3)" defaultValue={editingSection?.display_order || 0} className={inputClass}/>
                <div className="flex gap-2 mt-3">
                    <button type="submit" className={buttonPrimaryClass} disabled={isLoading}>Save Section</button>
                    <button type="button" onClick={() => {setIsCreatingSection(false); setEditingSection(null);}} className={buttonSecondaryClass}>Cancel</button>
                </div>
            </form>
          </div>
        )}

        <div className="p-6 space-y-6">
          {sections.map((section) => (
            <div key={section.id} className="p-4 border-2 border-black rounded-none bg-white shadow-[4px_4px_0_rgba(0,0,0,0.05)]">
              <div className="flex justify-between items-center mb-3 pb-2 border-b border-black">
                <h3 className="text-lg font-bold text-black">{section.title} <span className="text-sm font-normal text-gray-600">(Type: {section.type}, Order: {section.display_order})</span></h3>
                <div className="space-x-2">
                  <button onClick={() => { setEditingSection(section); setIsCreatingSection(false);}} className={buttonActionSmallClass('bg-blue-300', 'bg-blue-400')}>Edit Section</button>
                  <button onClick={() => handleDeleteSection(section.id)} className={buttonActionSmallClass('bg-red-300', 'bg-red-400', 'text-white')}>Del Section</button>
                </div>
              </div>
              {section.type === 'markdown' && (
                <div className="prose prose-sm max-w-none text-gray-800 font-space"><p>{section.content || <span className="italic">No content.</span>}</p></div> /* Added font-space */
              )}

              {section.type === 'list_items' && (
                <div className="mt-4 space-y-3">
                  <h4 className="font-bold text-black">Items:</h4>
                  {section.portfolio_items && section.portfolio_items.length > 0 ? section.portfolio_items.map(item => (
                    <div key={item.id} className="p-3 border-2 border-black bg-gray-50 rounded-none">
                      <div className="flex justify-between items-start">
                        <div>
                            <p className="font-bold text-black">{item.title}</p>
                            <p className="text-sm text-indigo-700 font-semibold">{item.subtitle}</p>
                            {item.description && <p className="text-xs mt-1 text-gray-700">{item.description.substring(0,100)}...</p>}
                        </div>
                        <div className="space-x-1">
                            <button onClick={() => { setEditingItem(item); setIsCreatingItemInSection(section.id); }} className={buttonActionSmallClass('bg-blue-300', 'bg-blue-400')}>Edit</button>
                            <button onClick={() => handleDeleteItem(item.id)} className={buttonActionSmallClass('bg-red-300', 'bg-red-400', 'text-white')}>Del</button>
                        </div>
                      </div>
                    </div>
                  )) : <p className="text-sm text-gray-600 italic">No items in this section yet.</p>}
                  <button
                    onClick={() => {setIsCreatingItemInSection(section.id); setEditingItem(null);}}
                    className={`${buttonPrimaryClass} text-sm mt-2`}
                  >+ Add Item to "{section.title}"</button>
                </div>
              )}
              {( (isCreatingItemInSection === section.id && !editingItem) || (editingItem && editingItem.section_id === section.id) ) && (
                <div className="p-4 mt-4 border-t-2 border-black bg-yellow-50">
                    <h4 className="text-md font-bold text-black mb-2">
                        {editingItem ? `Edit Item: ${editingItem.title}` : "Create New Item"}
                    </h4>
                    <form onSubmit={(e: FormEvent<HTMLFormElement>) => {
                        e.preventDefault();
                        const formData = new FormData(e.currentTarget);
                        const data: Partial<PortfolioItem> = {
                            title: formData.get('item_title') as string,
                            subtitle: formData.get('item_subtitle') as string || null,
                            description: formData.get('item_description') as string || null,
                            link_url: formData.get('item_link') as string || null,
                            image_url: formData.get('item_image_url') as string || null, // Added image_url
                            tags: (formData.get('item_tags') as string)?.split(',').map(t => t.trim()).filter(t => t) || null,
                            display_order: parseInt(formData.get('item_display_order') as string) || 0,
                        };
                        handleSaveItem(data, section.id);
                    }}>
                        <input name="item_title" placeholder="Item Title" defaultValue={editingItem?.title} required className={inputClass}/>
                        <input name="item_subtitle" placeholder="Item Subtitle" defaultValue={editingItem?.subtitle || ''} className={inputClass}/>
                        <textarea name="item_description" placeholder="Item Description (Markdown supported for public)" defaultValue={editingItem?.description || ''} className={textareaClass}/>
                        <input name="item_link" placeholder="Item Link URL (e.g. https://example.com)" defaultValue={editingItem?.link_url || ''} className={inputClass}/>
                        <input name="item_image_url" placeholder="Item Image URL (e.g. https://.../image.png)" defaultValue={editingItem?.image_url || ''} className={inputClass}/>
                        <input name="item_tags" placeholder="Tags (comma-separated)" defaultValue={editingItem?.tags?.join(', ') || ''} className={inputClass}/>
                        <input type="number" name="item_display_order" placeholder="Order" defaultValue={editingItem?.display_order || 0} className={inputClass}/>

                        <div className="flex gap-2 mt-2">
                            <button type="submit" className={buttonPrimaryClass} disabled={isLoading}>Save Item</button>
                            <button type="button" onClick={() => {setIsCreatingItemInSection(null); setEditingItem(null);}} className={buttonSecondaryClass}>Cancel</button>
                        </div>
                    </form>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}