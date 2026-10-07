export interface AnnouncementPageData {
  title: string;
  content: string;
}

export interface AnnouncementData {
  title: string;
  pages: AnnouncementPageData[];
}

export function decodeAnnouncementPages(
  announcementData: unknown,
): AnnouncementPageData[] {
  if (!announcementData || typeof announcementData !== 'object') {
    return [];
  }

  const pages = (announcementData as Partial<AnnouncementData>).pages;
  if (!Array.isArray(pages)) {
    return [];
  }

  return pages
    .filter((page: any) => typeof page?.title === 'string' && typeof page?.content === 'string')
    .map((page: AnnouncementPageData) => ({
      title: page.title,
      content: page.content,
    }));
}
