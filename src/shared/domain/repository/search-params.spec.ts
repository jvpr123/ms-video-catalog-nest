import { SearchParams, SortDirection } from "./search-params";

describe('SearchParams Unit Tests', () => {
    test('should return search params with default values when no prop is given in constructor', () => {
        const output = new SearchParams();
        expect(output.page).toBe(1);
        expect(output.per_page).toBe(1);
        expect(output.sort).toBeNull();
        expect(output.sort_dir).toBeNull();
        expect(output.filter).toBeNull();
    });

    test('should set page prop given in constructor', () => {
        const params = { page: 2 };
        const output = new SearchParams(params);
        expect(output.page).toBe(params.page);
    });

    test('should cast and set page prop when invalid value given in constructor', () => {
        const params = { page: NaN };
        const output = new SearchParams(params);
        expect(output.page).toBe(1);
    });

    test('should set per_page prop given in constructor', () => {
        const params = { per_page: 10 };
        const output = new SearchParams(params);
        expect(output.per_page).toBe(params.per_page);
    });

    test('should cast and set per_page prop when invalid value given in constructor', () => {
        const params = { per_page: -5 };
        const output = new SearchParams(params);
        expect(output.per_page).toBe(1);
    });

    test('should set sort prop given in constructor', () => {
        const params = { sort: 'entity_id' };
        const output = new SearchParams(params);
        expect(output.sort).toBe(params.sort);
        expect(output.sort_dir).toBe('asc');
    });

    test('should cast and set sort prop when invalid value given in constructor', () => {
        const params = { sort: '' };
        const output = new SearchParams(params);
        expect(output.sort).toBeNull();
        expect(output.sort_dir).toBeNull();
    });

    test('should set sort_dir prop to NULL when no sort prop given in constructor', () => {
        const params = { sort_dir: 'asc' as SortDirection };
        const output = new SearchParams(params);
        expect(output.sort).toBeNull();
        expect(output.sort_dir).toBeNull();
    });

    test('should set sort_dir prop to `asc` by default when sort prop given in constructor', () => {
        const params = { sort: 'entity_id' };
        const output = new SearchParams(params);
        expect(output.sort).toBe(params.sort);
        expect(output.sort_dir).toBe('asc');
    });

    test('should cast and set sort_dir prop to `asc` when invalid value given in constructor', () => {
        const params = { sort: 'entity_id', sort_dir: 'invalid_sort_dir' as SortDirection };
        const output = new SearchParams(params);
        expect(output.sort).toBe(params.sort);
        expect(output.sort_dir).toBe('asc');
    });

    test('should set sort_dir prop given in constructor', () => {
        const params = { sort: 'entity_id', sort_dir: 'desc' as SortDirection };
        const output = new SearchParams(params);
        expect(output.sort).toBe(params.sort);
        expect(output.sort_dir).toBe(params.sort_dir);
    });

    test('should set filter prop given in constructor', () => {
        const params = { filter: 'status' };
        const output = new SearchParams(params);
        expect(output.filter).toBe(params.filter);
    });

    test('should cast and set filter prop to NULL when invalid value given in constructor', () => {
        const params = { filter: '' };
        const output = new SearchParams(params);
        expect(output.filter).toBeNull();
    });
});