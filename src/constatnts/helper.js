export const getRoomId = (userId1, userId2) => {
  const sortedIds = [userId1, userId2].sort();
  const roomId = sortedIds.join('-');
  return roomId;
};

export const formatDate = date => {
  var time = new Date(date);
  var day = time.getDate();
  var monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  var month = monthNames[time.getMonth()];

  // Convert to 12-hour format
  var hours = time.getHours();
  var minutes = time.getMinutes();
  var ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // The hour '0' should be '12'
  minutes = minutes < 10 ? '0' + minutes : minutes; // Add leading zero to minutes if needed

  var formattedDate = `${day} ${month} ${hours}:${minutes} ${ampm}`;
  return formattedDate;
};
