function formatNumber(num)
{
  num = String(num);

  var firstChunk = num.length % 3;

  var newString = num.slice(0, firstChunk);

  for(var i = firstChunk; i < num.length; i += 3)
  {
    newString = newString + " " + num.slice(i, i+3);
  }

  return newString;
}
