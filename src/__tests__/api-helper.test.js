import { getNewsEndpoint } from '../js/helpers/api-helper';

describe('api-helper', () => {
    describe('getNewsEndpoint', () => {
        it('should return a correct endpoint when no params are passed', () => {
            // given
            const expectedFromParam = '&from-date=';
            const expectedPageParam = '&page=';
            const expectedApiKeyParam = '&api-key=';
            // when
            const defaultEndpoint = getNewsEndpoint();
            // then
            expect(defaultEndpoint.includes(expectedFromParam)).toBe(true);
            expect(defaultEndpoint.includes(expectedPageParam)).toBe(true);
            expect(defaultEndpoint.includes(expectedApiKeyParam)).toBe(true);
        });

        it('should add section query param with correct value if it is passed', () => {
            // given
            const givenSection = 'sports';
            const expectedSectionParam = `?section=${givenSection}`;
            // when
            const defaultEndpoint = getNewsEndpoint(givenSection);
            // then
            expect(defaultEndpoint.includes(expectedSectionParam)).toBe(true);
        });

        it('should add searchPhrase query param with correct value if it is passed', () => {
            // given
            const givenSearchPhrase = 'weather';
            const expectedSearchPhrase = `&q=${givenSearchPhrase}`;
            // when
            const defaultEndpoint = getNewsEndpoint('', '', expectedSearchPhrase);
            // then
            expect(defaultEndpoint.includes(expectedSearchPhrase)).toBe(true);
        });
    });
});
