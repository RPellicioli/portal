import { UrlSegment, Route, UrlSegmentGroup, UrlMatchResult } from "@angular/router";

export namespace CaseInsensitiveMatcher {
    export function matcher(segments: UrlSegment[], segmentGroup: UrlSegmentGroup, route: Route): UrlMatchResult {
        const url = (route as any).matcherPath;
        if (url) {
            const matchSegments = url.split('/');
            if (matchSegments.length > segments.length || (matchSegments.length !== segments.length && route.pathMatch === 'full')) {
                return null;
            }

            const consumed: UrlSegment[] = [];
            const posParams: { [name: string]: UrlSegment } = {};
            for (let index = 0; index < segments.length; ++index) {
                const matchSegment = matchSegments[index];
                if (matchSegment) {
                    if (matchSegment.startsWith(':')) {
                        posParams[matchSegment.slice(1)] = segments[index];
                        consumed.push(segments[index]);
                    } else if (segments[index].toString().toLowerCase() === matchSegment.toLowerCase()) {
                        consumed.push(segments[index]);
                    } else {
                        return null;
                    }
                } else {
                    return null;
                }
            }

            return { consumed, posParams };
        }

        return null;
    }
}