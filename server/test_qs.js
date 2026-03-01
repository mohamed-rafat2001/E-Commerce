import qs from 'qs';
console.log(qs.parse('countInStock[gt]=0'));
console.log(qs.parse('countInStock[gt]=0&countInStock[lte]=10'));
