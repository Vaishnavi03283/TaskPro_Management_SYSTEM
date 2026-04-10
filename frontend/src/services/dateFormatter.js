
// Date formatting utility that provides consistent date and time display formats for comments and timestamps
export const formatCommentDate = (dateString) => {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  
  if (isNaN(date.getTime())) {
    return 'Invalid Date';
  }

  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 || 12;
  const formattedMinutes = String(minutes).padStart(2, '0');
  const timeString = `${formattedHours}:${formattedMinutes} ${ampm}`;
 
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  const dateOnlyString = `${month}/${day}/${year}`;
  
  return `${timeString} ${dateOnlyString}`;
};
