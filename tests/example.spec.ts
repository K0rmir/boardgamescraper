import { test, expect } from '@playwright/test';

// Check if URL contains the board game name 
test('has title', async ({ page }) => {
  await page.goto('https://www.amazon.co.uk/Stonemaier-Games-Wyrmspan-Players-Minutes/dp/B0CJXNW71N/ref=sr_1_5?crid=120Z7NHDBPNHG&dib=eyJ2IjoiMSJ9.QF_5IqwMwtyGdkHhoqH7kmG83P5SVDLuroiu9g2H_DASnQKbYa5tTPQ8I5rqjUG_oqvOz2dP_3M9uhk-Jb4-EU4cYBHveCX2N56aCxG-8Q-C65NToDn-R7A9tTTilmbtBS6avBNiT3ZM6yA4Glslm05Kq3px6WC858556PqFL0Y5LgJdU-ICBimdft_tGYW33cHBFCMGwjwJMtAzyZtFetv272YtqnWJXmplNUR_WfZ3rE3ru-xvf9MG0UWkibpJAmBrTKroY-xzh_HaWhU7R-lzGCyKUWa8d3SUCk_b7oc.sy_9hFtnD5W9zKhuqhCpW4-mhmqJwhhOJ9aSY3S7bJE&dib_tag=se&keywords=wyrmspan%2Bboard%2Bgame&qid=1715681953&sprefix=wyrmspa%2Caps%2C103&sr=8-5&th=1');
  await expect(page).toHaveTitle(/Wyrmspan/);
});

// Check if the product is on sale
test('is on sale', async ({ page }) => {
  await page.goto('https://www.amazon.co.uk/Stonemaier-Games-Wyrmspan-Players-Minutes/dp/B0CJXNW71N/ref=sr_1_5?crid=120Z7NHDBPNHG&dib=eyJ2IjoiMSJ9.QF_5IqwMwtyGdkHhoqH7kmG83P5SVDLuroiu9g2H_DASnQKbYa5tTPQ8I5rqjUG_oqvOz2dP_3M9uhk-Jb4-EU4cYBHveCX2N56aCxG-8Q-C65NToDn-R7A9tTTilmbtBS6avBNiT3ZM6yA4Glslm05Kq3px6WC858556PqFL0Y5LgJdU-ICBimdft_tGYW33cHBFCMGwjwJMtAzyZtFetv272YtqnWJXmplNUR_WfZ3rE3ru-xvf9MG0UWkibpJAmBrTKroY-xzh_HaWhU7R-lzGCyKUWa8d3SUCk_b7oc.sy_9hFtnD5W9zKhuqhCpW4-mhmqJwhhOJ9aSY3S7bJE&dib_tag=se&keywords=wyrmspan%2Bboard%2Bgame&qid=1715681953&sprefix=wyrmspa%2Caps%2C103&sr=8-5&th=1');
  // Expect the 'savingPriceOverride' element to exist, indicating the product is on sale. 
  expect(page.locator('span.savingPriceOverride'))
})


