export const getBadgeColor = (status: string) => {
  let color = 'clickable ml-20 mr-20'

  if (status === 'Pending') {
    color += ' bg-info'
  } else if (status === 'Approved') {
    color += ' bg-success'
  } else {
    color += ' bg-error'
  }
  return color;
}

export const getServiceIcon = (service: string) => {
  let icon = 'fa-database'
  if (service === 'Elasticsearch') {
    icon = 'fa-search'
  } else if (service === 'Redis') {
    icon = 'fa-server'
  } else {
    icon = 'fa-database'
  }
  return icon;
}