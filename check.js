//unfinished blacklist for new extention

(async () => {
const blacklistedLinks = ['https://connergamer.itch.io'];

const isBlacklisted = (blacklistedLinks.some(link => (document.referrer).startsWith(link)));

if (isBlacklisted)
{
  alert('hi')
  return;
}
})();
