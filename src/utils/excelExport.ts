import * as XLSX from 'xlsx';

export interface PostData {
  id: string;
  platform: string;
  caption: string;
  media?: string;
  scheduledDate: string;
  scheduledTime: string;
  status: 'scheduled' | 'scheduling' | 'failed';
}

export const exportToExcel = (posts: PostData[]) => {
  // Transform data to match the required Excel format
  const excelData = posts.map(post => ({
    'Date & Time': `${post.scheduledDate} ${post.scheduledTime}`,
    'Platform': post.platform,
    'Caption': post.caption,
    'Status': post.status.charAt(0).toUpperCase() + post.status.slice(1) // Capitalize first letter
  }));

  // Create a new workbook
  const workbook = XLSX.utils.book_new();
  
  // Create a worksheet from the data
  const worksheet = XLSX.utils.json_to_sheet(excelData);

  // Set column widths for better readability
  const columnWidths = [
    { wch: 20 }, // Date & Time
    { wch: 15 }, // Platform
    { wch: 50 }, // Caption
    { wch: 12 }  // Status
  ];
  worksheet['!cols'] = columnWidths;

  // Add the worksheet to the workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Scheduled Posts');

  // Generate filename with current date
  const currentDate = new Date().toISOString().split('T')[0];
  const filename = `social-scheduler-posts-${currentDate}.xlsx`;

  // Write the file and trigger download
  XLSX.writeFile(workbook, filename);

  return filename;
};

// Alternative function for CSV export (if needed)
export const exportToCSV = (posts: PostData[]) => {
  const headers = ['Date & Time', 'Platform', 'Caption', 'Status'];
  const csvData = posts.map(post => [
    `${post.scheduledDate} ${post.scheduledTime}`,
    post.platform,
    `"${post.caption.replace(/"/g, '""')}"`, // Escape quotes in CSV
    post.status.charAt(0).toUpperCase() + post.status.slice(1)
  ]);

  const csvContent = [headers, ...csvData]
    .map(row => row.join(','))
    .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `social-scheduler-posts-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}; 