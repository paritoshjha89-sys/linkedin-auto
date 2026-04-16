export const personalize = (template: string, lead: any) => {
  return template.replace(/{{(.*?)}}/g, (match, key) => {
    const normalizedKey = key.trim().toLowerCase();
    
    // Support common mappings
    if (normalizedKey === 'first_name') return lead.firstName || lead.first_name || "";
    if (normalizedKey === 'last_name') return lead.lastName || lead.last_name || "";
    
    return lead[normalizedKey] || lead[key.trim()] || "";
  });
};
