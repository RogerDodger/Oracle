async function fetchapi(url, opt_) {
   let opt = opt_ || {}
   if (!('credentials' in opt)) {
      opt.credentials = 'include';
   }

   return fetch('/api' + url, opt);
}

export { fetchapi };
