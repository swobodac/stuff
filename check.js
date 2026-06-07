//unfinished blacklist for new extention ig

(async () => {
console.log('making sure im running gng')
const blacklistedLinks = ['https://connergamer.itch.io' 'connergamer.itch.io'];

const isBlacklisted = (blacklistedLinks.some(link => (document.referrer).startsWith(link)));

if (isBlacklisted)
{
  alert('hi')
  return;
}
})();
