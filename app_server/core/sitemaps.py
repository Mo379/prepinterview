from django.conf import settings
from django.contrib.sitemaps import Sitemap
from blog.models import Blog


class Site:
    if 'https://' in settings.SITE_URL:
        domain = settings.SITE_URL.split('https://')[1]
    else:
        domain = settings.SITE_URL


class FrontSite:
    if 'https://' in settings.FRONT_SITE_URL:
        domain = settings.FRONT_SITE_URL.split('https://')[1]
    elif 'http://' in settings.FRONT_SITE_URL:
        domain = settings.FRONT_SITE_URL.split('http://')[1]
    else:
        domain = settings.FRONT_SITE_URL


class StaticViewSitemap(Sitemap):
    protocol = "https"

    def items(self):
        return [
            "",
        ]

    def location(self, item):
        return f"/{item}"


class BlogSitemap(Sitemap):
    protocol = "https"

    def get_urls(self, site=None, **kwargs):
        site = FrontSite()
        return super(BlogSitemap, self).get_urls(site=site, **kwargs)

    def items(self):
        return Blog.objects.all()

    def location(self, item):
        return f"/blog/{item.slug}"
