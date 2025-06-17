import requests
from bs4 import BeautifulSoup
import pandas as pd
from pymongo import MongoClient
from datetime import datetime, timezone
import re
import time
import random

API_KEY = '68c9e95c4dcee4a441a4fd1fad88afcd'
SCRAPERAPI_URL = 'https://api.scraperapi.com/'

FREE_PROXIES = [
    "http://103.169.252.20:8080",
    "http://103.180.149.65:45745",
    "http://103.178.43.122:8181",
    "http://103.186.240.242:8181",
    "http://103.155.199.27:3128"
]

def get_html(url, retries=5, timeout=30):
    for attempt in range(retries):
        try:
            print(f"Trying ScraperAPI... Attempt {attempt + 1}")
            params = {
                'api_key': API_KEY,
                'url': url,
                'country_code': 'in'
            }
            response = requests.get(SCRAPERAPI_URL, params=params, timeout=timeout)
            if response.status_code == 200:
                return response.text
        except requests.exceptions.RequestException as e:
            print(f"ScraperAPI error: {e}")
        time.sleep(2)

    print("ScraperAPI failed. Trying free proxies...")
    for proxy in random.sample(FREE_PROXIES, len(FREE_PROXIES)):
        try:
            print(f"Trying proxy: {proxy}")
            response = requests.get(url, proxies={"http": proxy, "https": proxy}, timeout=timeout)
            if response.status_code == 200:
                return response.text
        except requests.exceptions.RequestException as e:
            print(f"Proxy error: {e}")
        time.sleep(2)

    print("All attempts failed for URL:", url)
    return None

def connect_to_mongo():
    client = MongoClient("mongodb+srv://sam:Thebest123@cluster0.urqzkie.mongodb.net/")
    return client["product_data"]

def scrape_flipkart(query, pages=3):
    products = []
    for page in range(1, pages + 1):
        url = f'https://www.flipkart.com/search?q={query}&page={page}'
        html = get_html(url)
        if not html:
            continue

        soup = BeautifulSoup(html, 'html.parser')
        items = soup.select('div[data-id]')

        for item in items:
            title = item.select_one('.KzDlHZ')
            price = item.select_one('.Nx9bqj._4b5DiR')
            rating = item.select_one('.XQDdHH')
            reviews = item.select_one('.Wphh3N')
            link = item.select_one('a[href^="/"]')
            image = item.select_one('img[src]')

            rating_value = re.findall(r"\d+\.\d+", rating.get_text()) if rating else []
            rating_value = float(rating_value[0]) if rating_value else 'N/A'

            product_name = title.get_text(strip=True) if title else 'N/A'
            memory_match = re.search(r'(\d+\s?(GB|TB))', product_name, re.I)

            products.append({
                'Category': query,
                'Product Name': product_name,
                'Memory': memory_match.group(1) if memory_match else 'N/A',
                'Price': price.get_text(strip=True) if price else 'N/A',
                'Ratings': rating.get_text(strip=True) if rating else 'N/A',
                'Reviews': reviews.get_text(strip=True) if reviews else '0',
                'Links': f"https://www.flipkart.com{link['href']}" if link and link.has_attr('href') else 'N/A',
                'Image': image['src'] if image and image.has_attr('src') else 'N/A',
                'Source': 'Flipkart',
                'Timestamp': datetime.now(timezone.utc)
            })

    return products

def scrape_amazon(query, pages=3):
    products = []
    for page in range(1, pages + 1):
        url = f'https://www.amazon.in/s?k={query}&page={page}'
        html = get_html(url)
        if not html:
            continue

        soup = BeautifulSoup(html, 'html.parser')
        items = soup.select('div[data-component-type="s-search-result"]')

        for item in items:
            title = item.select_one('h2 span')
            price = item.select_one('span.a-price-whole')
            rating = item.select_one('span.a-icon-alt')
            reviews = item.select_one('span.a-size-base')
            link = item.select_one('a[href^="/"]')
            image = item.select_one('img[src]')

            product_name = title.get_text() if title else 'N/A'
            memory_match = re.search(r'(\d+\s?(GB|TB))', product_name, re.I)

            rating_value = re.findall(r"\d+\.\d+", rating.get_text()) if rating else []
            rating_value = float(rating_value[0]) if rating_value else 'N/A'

            products.append({
                'Category': query,
                'Product Name': product_name,
                'Memory': memory_match.group(1) if memory_match else 'N/A',
                'Price': price.get_text() if price else 'N/A',
                'Ratings': rating_value,
                'Reviews': reviews.get_text() if reviews else '0',
                'Links': f"https://www.amazon.in{link['href']}" if link else 'N/A',
                'Image': image['src'] if image and image.has_attr('src') else 'N/A',
                'Source': 'Amazon',
                'Timestamp': datetime.now(timezone.utc)
            })
    return products

def insert_data(data, platform):
    db = connect_to_mongo()
    collection = db[f"{platform.lower()}_products"]
    for record in data:
        existing = collection.find_one({
            "Product Name": record["Product Name"],
            "Source": record["Source"]
        })
        new_price_entry = {
            "Price": record["Price"],
            "Timestamp": record["Timestamp"]
        }

        if existing:
            collection.update_one(
                {"_id": existing["_id"]},
                {
                    "$set": {
                        "Latest Price": record["Price"],
                        "Category": record["Category"],
                        "Image": record["Image"],
                        "Memory": record["Memory"]
                    },
                    "$push": {"Price History": new_price_entry}
                }
            )
        else:
            record["Price History"] = [new_price_entry]
            record["Latest Price"] = record["Price"]
            collection.insert_one(record)

# Brand-based queries
categories = [
    'lenovo laptop', 'macbook', 'acer laptop',
    'samsung phone', 'apple phone', 'xiaomi phone',
    'samsung tv', 'xiaomi tv', 'sony tv'
]

for category in categories:
    print(f"Scraping Amazon for {category}")
    amazon_data = scrape_amazon(category, pages=5)
    insert_data(amazon_data, 'Amazon')

    print(f"Scraping Flipkart for {category}")
    flipkart_data = scrape_flipkart(category, pages=5)
    insert_data(flipkart_data, 'Flipkart')

    time.sleep(5)  # Respectful delay between category scrapes
